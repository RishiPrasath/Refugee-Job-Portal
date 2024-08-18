from django.apps import AppConfig

class RjbConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'rjb'

    def ready(self):
        from rjb.notifications import signals, handlers
        signals.create_candidate.connect(handlers.handle_create_candidate)