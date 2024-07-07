from django.db import models
from django.contrib.auth.models import AbstractUser

# User model to manage user accounts, including authentication details and roles.
class User(AbstractUser):
    # Role of the user (e.g., candidate, employer, admin)
    role = models.CharField(max_length=50)

    # Add related_name attributes to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='rjb_user_set',  # Change related_name to avoid clash
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='rjb_user_set',  # Change related_name to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

# New Qualification model
class Qualification(models.Model):
    school = models.CharField(max_length=255)
    qualification = models.CharField(max_length=255)
    start_year = models.IntegerField()
    end_year = models.IntegerField()
    candidate = models.ForeignKey('CandidateProfile', on_delete=models.CASCADE)

# New WorkExperience model
class WorkExperience(models.Model):
    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    start_year = models.IntegerField()
    end_year = models.IntegerField()
    description = models.TextField(null=True, blank=True)
    skills = models.ManyToManyField('Skill', blank=True)
    candidate = models.ForeignKey('CandidateProfile', on_delete=models.CASCADE)

def candidate_profile_picture_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/profile_pictures/<user_id>_<candidate_id>/<filename>
    return f'profile_pictures/{instance.user.id}_{instance.id}/{filename}'



# Candidate profile model to store comprehensive user profiles detailing personal, contact, and professional information.
class CandidateProfile(models.Model):
    # Foreign key linking to the User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Full name of the candidate
    full_name = models.CharField(max_length=255)
    # Date of birth of the candidate
    date_of_birth = models.DateField(null=True, blank=True)
    # Contact phone number of the candidate
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    # Name of the emergency contact
    emergency_contact_name = models.CharField(max_length=255, null=True, blank=True)
    # Phone number of the emergency contact
    emergency_contact_phone = models.CharField(max_length=20, null=True, blank=True)
    # LinkedIn profile URL of the candidate
    linkedin_profile = models.URLField(null=True, blank=True)
    # GitHub profile URL of the candidate
    github_profile = models.URLField(null=True, blank=True)
    # Summary or bio of the candidate
    summary = models.TextField(null=True, blank=True)
    # Skills of the candidate
    skills = models.ManyToManyField('Skill', blank=True)
    # Accessibility requirements of the candidate
    accessibility_requirements = models.TextField(null=True, blank=True)
    # Immigration status of the candidate
    immigration_status = models.CharField(max_length=50, null=True, blank=True)
    # Profile picture of the candidate
    profile_picture = models.ImageField(upload_to=candidate_profile_picture_directory_path, null=True, blank=True)
    # Status of the candidate (e.g., active, inactive)
    status = models.CharField(max_length=50)


def employer_logo_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/logos/<user_id>_<employer_id>/<filename>
    return f'logos/{instance.user.id}_{instance.id}/{filename}'


# Employer profile model to store comprehensive employer profiles detailing contact, company, and operational information.
class EmployerProfile(models.Model):
    # Foreign key linking to the User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Name of the company or employer
    company_name = models.CharField(max_length=255)
    # Industry in which the employer operates
    industry = models.CharField(max_length=255)
    # Primary contact phone number for the employer
    contact_phone = models.CharField(max_length=20, default=' ')
    # Physical address or primary location of the employer
    location = models.CharField(max_length=255)
    # URL of the employer's official website
    website_url = models.URLField(null=True, blank=True)
    # URL for the employer's logo
    logo = models.ImageField(upload_to=employer_logo_directory_path, null=True, blank=True)
    # Brief description of the company, its mission, and core values
    description = models.TextField(null=True, blank=True)
    # Soft deletion flag
    is_active = models.BooleanField(default=True)

# New HiringCoordinatorProfile model
class HiringCoordinatorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)

# New CaseWorkerProfile model
class CaseWorkerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)

# Skills model to catalog a variety of skills that can be associated with user profiles and job postings.
class Skill(models.Model):
    # Name of the skill
    skill_name = models.CharField(max_length=255)
    # Description of the skill
    description = models.TextField(null=True, blank=True)

# Intermediate model to link candidates and their skills, supporting a many-to-many relationship.
class CandidateHasSkill(models.Model):
    # Foreign key linking to the CandidateProfile model
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE)
    # Foreign key linking to the Skill model
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('candidate', 'skill')

# Job postings model to store job listings posted by employers, including requirements and status.
class JobPosting(models.Model):
    # Foreign key linking to the EmployerProfile model
    employer = models.ForeignKey(EmployerProfile, on_delete=models.SET_NULL, null=True, blank=True)
    # Title of the job
    job_title = models.CharField(max_length=255)
    # Description of the job
    job_description = models.TextField(null=True, blank=True)
    # Requirements for the job
    requirements = models.TextField(null=True, blank=True)
    # Location of the job
    location = models.CharField(max_length=255, null=True, blank=True)
    # Compensation amount for the job
    compensation_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # Type of compensation (e.g., hourly, monthly, annual)
    compensation_type = models.CharField(max_length=50, null=True, blank=True)
    # Type of job (e.g., full-time, part-time, contract, internship)
    job_type = models.CharField(max_length=50, null=True, blank=True)
    # Employment term (e.g., permanent, temporary)
    employment_term = models.CharField(max_length=50, null=True, blank=True)
    # Status of the job posting (e.g., open, closed, archived)
    status = models.CharField(max_length=50)
    # Indicates whether immigration assistance is provided
    immigration_assistance = models.BooleanField(null=True, blank=True)

# Intermediate model to map job postings to their required skills, enabling skill-specific job searches.
class JobRequiresSkill(models.Model):
    # Foreign key linking to the JobPosting model
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    # Foreign key linking to the Skill model
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('job', 'skill')

# Applications model to track job applications submitted by candidates, including their status and associated documents.
class Application(models.Model):
    # Foreign key linking to the JobPosting model
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    # Foreign key linking to the User model
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    # Cover letter for the application
    cover_letter = models.TextField(null=True, blank=True)
    # CV for the application
    cv = models.BigIntegerField(null=True, blank=True)
    # Status of the application (e.g., submitted, reviewed, accepted, rejected)
    status = models.CharField(max_length=50)

# Interviews model to manage scheduling and outcomes of interviews linked to job applications.
class Interview(models.Model):
    # Foreign key linking to the Application model
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    # Foreign key linking to the User model (interviewer)
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    # Timestamp of when the interview is scheduled
    scheduled_at = models.DateTimeField(null=True, blank=True)
    # Location of the interview
    interview_location = models.CharField(max_length=255, null=True, blank=True)
    # Status of the interview (e.g., scheduled, completed, canceled)
    status = models.CharField(max_length=50)
    # Feedback from the interview
    feedback = models.TextField(null=True, blank=True)

# Notifications model to store notifications for users, including details on whether they have been read.
class Notification(models.Model):
    # Foreign key linking to the User model
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Notification message
    message = models.TextField()
    # Indicates if the notification has been read
    read_status = models.BooleanField(default=False)

# Messages model to facilitate message exchanges between users, supporting direct communication within the platform.
class Message(models.Model):
    # Foreign key linking to the User model (sender)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    # Foreign key linking to the User model (receiver)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    # Content of the message
    content = models.TextField(null=True, blank=True)
    # Category of the message
    category = models.CharField(max_length=255, null=True, blank=True)
    # Timestamp of when the message was sent
    sent_at = models.DateTimeField(auto_now_add=True)

