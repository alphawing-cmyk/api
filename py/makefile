start:
	@uvicorn main:app --reload --port 7100
celery_start:
	@celery -A celery_app.celery_app worker -l info -c 4
celery_beat:
	@celery -A celery_app.celery_app beat -l info