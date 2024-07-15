from django.core.management.base import BaseCommand
from django.apps import apps
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

class Command(BaseCommand):
    help = 'Lists all models and their objects with field data and saves it to a PDF'

    def handle(self, *args, **options):
        model_names = [
            'User', 'Qualification', 'WorkExperience', 'CandidateProfile', 
            'EmployerProfile', 'HiringCoordinatorProfile', 'CaseWorkerProfile', 
            'Skill', 'CandidateHasSkill', 'JobPosting', 'JobRequiresSkill', 
            'Application', 'Interview', 'Notification', 'Message'
        ]
        models = [model for model in apps.get_models() if model.__name__ in model_names]

        # Ensure the directory exists
        os.makedirs('RecordsExport', exist_ok=True)
        c = canvas.Canvas('RecordsExport/models_data.pdf', pagesize=letter)
        text = c.beginText(40, 750)
        text.setFont("Helvetica", 12)

        for model in models:
            model_header = f"Model: {model.__name__}"
            self.stdout.write(self.style.SUCCESS(model_header))
            text.textLine(model_header)
            text.textLine("=" * 50)

            for obj in model.objects.all():
                obj_data = [f"Object ID: {obj.id}"]
                console_output = [f"Object ID: {obj.id}"]
                for field in model._meta.fields:
                    field_value = getattr(obj, field.name)
                    field_str = f"{field.name}: {field_value}"
                    obj_data.append(field_str)
                    console_output.append(field_str)
                
                obj_data_str = ", ".join(obj_data)
                console_output_str = ", ".join(console_output)
                self.stdout.write(console_output_str)
                text.textLine(obj_data_str)
                text.textLine("-" * 50)
            
            text.textLine("\n")  # Add a space between models

        c.drawText(text)
        c.save()
        self.stdout.write(self.style.SUCCESS('PDF successfully created and saved in RecordsExport folder.'))