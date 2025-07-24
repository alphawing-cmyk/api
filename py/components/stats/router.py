from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, text, func, update, String
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from components.database import get_session
from components.auth.utils import RBAChecker, ValidateJWT
from fastapi.encoders import jsonable_encoder
import pandas as pd
from .schemas import StatsParams, Github, GitLab
from components.symbols.models import Historical
from time import time
import aiohttp
from config import settings
import re
from components.services.indicators import Indicators
from .utils import setHistoricalDFColTypes


router = APIRouter()

@router.post(
    "/data",
    dependencies=[
        Depends(RBAChecker(roles=['admin', 'client'], permissions=None))]
)
async def get_data(
    params: StatsParams,
    session: AsyncSession = Depends(get_session),
):
    print(params)
    stmt = select(
        Historical.id, 
        Historical.custom_id, 
        Historical.ticker_id, 
        Historical.symbol,
        Historical.milliseconds,
        Historical.duration,
        Historical.open,
        Historical.low,
        Historical.high,
        Historical.close,
        Historical.adj_close,
        Historical.vwap,
        Historical.timestamp,
        Historical.transactions,
        Historical.source,
        Historical.market
    ) \
    .where(Historical.timestamp >= params.from_date) \
    .where(Historical.timestamp <= params.to_date) \
    .where(Historical.ticker_id == params.ticker_id) \
    .where(Historical.source == params.source)
    
    results   = await session.execute(stmt)
    data      = results.mappings().all()
    df        = pd.DataFrame(data)
    indicator = Indicators(df, params.indicators)
    indicator.processIndicators()
    df        = indicator.getDf()
    return df.to_dict(orient="records")




@router.post("/gitlab/repo", description="Get Gitlab commit count", response_model=None)
async def gitlab_repo(git: GitLab):
	TOKEN    = os.environ.get("gitlab_token")
	page     = 1
	headers  = {'PRIVATE-TOKEN': TOKEN}
	stop     = False
	count    = 0
	session  = aiohttp.ClientSession()

	while not stop:
		URL        = f"https://gitlab.com/api/v4/projects/{git.namespace}%2F{git.repo}/repository/commits?ref_name=master&all=true&per_page=100&page={page}"
		response  = await session.get(URL, headers=headers)
		json_data = await response.json()
		count     += len(json_data)
		page      += 1
		time.sleep(0.5)

		if len(json_data) == 0:
			stop = True

	await session.close()
	return {"commits": count}


@router.post("/github/repo", description="Get Github commit count", response_model=None)
async def github_repo(git: Github):
    headers = {}

    if git.token:
        headers['Authorization'] = f'token {git.token}'
    else:
        headers['Authorization'] = f'token {settings.github_personal_token}'
    
    headers['Accept'] = 'application/vnd.github+json'
    headers['X-GitHub-Api-Version'] = settings.github_api_version
          
    url    = f'https://api.github.com/repos/{git.owner}/{git.repo}/commits'
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{url}?per_page=1", headers=headers) as response:
                if response.status == 404:
                    raise HTTPException(status_code=404, detail="Repository not found")
                elif response.status != 200:
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"GitHub API error: {await response.text()}"
                    )
                
                if 'Link' in response.headers:
                    link_header = response.headers['Link']
                    if 'rel="last"' in link_header:
                        last_page_url = [link for link in link_header.split(',') if 'rel="last"' in link][0]
                        print(last_page_url)
                        commits = re.search(r'&page=(\d+)', last_page_url).group(1)

                        if commits:
                             return {"commits": int(commits)}
                        else:
                             return {"commits": 0}
        except aiohttp.ClientError as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch commits: {str(e)}")