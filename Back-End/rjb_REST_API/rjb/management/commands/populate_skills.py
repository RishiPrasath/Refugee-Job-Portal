from django.core.management.base import BaseCommand
from rjb.models import Skill

class Command(BaseCommand):
    help = 'Populate the Skill table with predefined skills'

    def handle(self, *args, **kwargs):
        available_skills = [
            'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'SQL', 'NoSQL', 'HTML', 'CSS',
            'C++', 'C#', 'Java', 'Go', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Rust',
            'Chemical Science', 'Biological Science', 'Archaeology', 'Graphic Design', 'Multimedia Design',
            'Laboratory Technician', 'Pharmaceutical Technician', 'Art', 'Dance', 'Music',
            'Arts Management', 'Agriculture', 'Fishing', 'Welding', 'Boat Building', 'Stonemasonry', 'Bricklaying',
            'Roofing', 'Carpentry', 'Construction', 'Retrofit', 'Care Work', 'Senior Care Work',
            'Animal Care', 'Deckhand', 'Project Management', 'Product Management', 'System Administration',
            'Network Engineering', 'Mobile Development', 'Content Writing', 'SEO', 'Marketing',
            'Sales', 'Customer Support', 'Business Analysis', 'Data Science', 'Air conditioning engineering',
            'Refrigeration technology', 'Automotive electrics', 'Vehicle mechanics', 'Bodyshop technology',
            'Aircraft maintenance', 'Marine engineering', 'Railway engineering', 'Electrical engineering',
            'Telecom engineering', 'Alarm systems engineering', 'Security systems engineering', 'Communication engineering',
            'Electronics engineering', 'Instrumentation technology', 'Optical technology', 'Watchmaking',
            'Boat building', 'Shipwright', 'Steel erection', 'Stone masonry', 'Joinery', 'Plumbing', 'Ventilation technology',
            'Glazing', 'Building maintenance', 'Plastering', 'Carpet fitting', 'Ceramic tiling', 'Upholstery',
            'Tailoring', 'Seamstress', 'Retail sales', 'Visual merchandising', 'Market research', 'Customer service',
            'Call center operations', 'Early education', 'Child care', 'Playwork', 'Animal grooming', 'Veterinary assistance',
            'Housekeeping', 'Residential care', 'Police support', 'Vehicle sales', 'Market trading', 'Mystery shopping',
            'Rail travel assistance', 'Air travel assistance', 'Bed and breakfast management', 'Construction supervision',
            'Chemical engineering', 'Mechanical engineering', 'Electrical maintenance', 'Calibration engineering',
            'Refrigeration maintenance', 'Optical instrumentation', 'Computer repair', 'IT support', 'Network installation',
            'Security systems installation', 'Fire systems installation', 'Alarm systems installation', 'CCTV installation',
            'Domestic appliance repair', 'Field engineering', 'Building construction management', 'Site supervision',
            'Property development', 'Dry stone walling', 'Chimney building', 'Gas fitting', 'Heating installation',
            'Joinery', 'Shop fitting', 'Window fitting', 'Site management', 'Construction management', 'Textile work',
            'Leather work', 'Shoe repair', 'Tailoring', 'Dressmaking', 'Machine repair', 'Process technology', 'Chemical processes'
        ]

        for skill_name in available_skills:
            skill, created = Skill.objects.get_or_create(skill_name=skill_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created new skill: {skill_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Skill already exists: {skill_name}"))