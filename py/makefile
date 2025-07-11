start:
	@uvicorn app:app --reload --port 6500
celery_start:
	@celery -A celery_app.celery_app worker -l info -c 4
celery_beat:
	@celery -A celery_app.celery_app beat -l info