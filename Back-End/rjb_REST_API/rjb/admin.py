from django.contrib import admin
from .models import (
    User, 
    Qualification, 
    WorkExperience, 
    CandidateProfile, 
    EmployerProfile, 
    JobPosting, 
    JobRequiresSkill, 
    Application, 
    Interview, 
    Notification, 
    Message, 
    Skill, 
    HiringCoordinatorProfile, 
    CaseWorkerProfile,
    CandidateSavesJobPosting,
    JobOffer,
    Event,
    ChatGroup
)

class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2')
    search_fields = ('user1__username', 'user2__username')

class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat_group', 'sender', 'timestamp')
    search_fields = ('chat_group__id', 'sender__username')
    list_filter = ('timestamp',)

class HiringCoordinatorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name')
    search_fields = ('user__username', 'full_name')

class CaseWorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name')
    search_fields = ('user__username', 'full_name')

class SkillAdmin(admin.ModelAdmin):
    list_display = ('skill_name',)
    search_fields = ('skill_name',)

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active')
    search_fields = ('username', 'email', 'role')
    list_filter = ('role', 'is_active')

    def delete_model(self, request, obj):
        if obj.role == 'employer':
            # Handle related EmployerProfile
            employer_profile = EmployerProfile.objects.filter(user=obj).first()
            if employer_profile:
                # Handle related JobPostings
                JobPosting.objects.filter(employer=employer_profile).update(employer=None)

                # Optionally delete or deactivate EmployerProfile
                employer_profile.delete()  # or employer_profile.is_active = False; employer_profile.save()

        elif obj.role == 'candidate':
            # Handle related CandidateProfile
            candidate_profile = CandidateProfile.objects.filter(user=obj).first()
            if candidate_profile:
                # Handle related Qualifications
                Qualification.objects.filter(candidate=candidate_profile).delete()
                
                # Handle related WorkExperiences
                WorkExperience.objects.filter(candidate=candidate_profile).delete()
                
                # Handle related Applications
                applications = Application.objects.filter(applicant=obj)
                for application in applications:
                    # Handle related Interviews
                    Interview.objects.filter(application=application).delete()
                    application.delete()
                
                # Optionally delete or deactivate CandidateProfile
                candidate_profile.delete()  # or candidate_profile.is_active = False; candidate_profile.save()

        # Finally, delete the User object
        obj.delete()

class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'industry', 'is_active')
    search_fields = ('company_name', 'industry')
    list_filter = ('industry', 'is_active')

    def delete_model(self, request, obj):
        # Soft delete the employer profile
        obj.is_active = False
        obj.save()

class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'contact_phone', 'status')
    search_fields = ('full_name', 'contact_phone')
    list_filter = ('status',)

class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('employer', 'job_title', 'status', 'location')
    search_fields = ('job_title', 'description')
    list_filter = ('status', 'job_type', 'employment_term')

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'applicant', 'status')
    search_fields = ('job__job_title', 'applicant__username')
    list_filter = ('status',)

class CandidateSavesJobPostingAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job_posting', 'saved_at')
    search_fields = ('candidate__user__username', 'job_posting__job_title')
    list_filter = ('saved_at',)

class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('job_posting', 'employer', 'candidate', 'offer_datetime', 'status')
    search_fields = ('job_posting__job_title', 'employer__company_name', 'candidate__full_name')
    list_filter = ('status', 'offer_datetime')

# Register your models here with the custom admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Qualification)
admin.site.register(WorkExperience)
admin.site.register(CandidateProfile, CandidateProfileAdmin)
admin.site.register(EmployerProfile, EmployerProfileAdmin)
admin.site.register(JobPosting, JobPostingAdmin)
admin.site.register(JobRequiresSkill)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(Interview)
admin.site.register(Notification)
admin.site.register(CandidateSavesJobPosting, CandidateSavesJobPostingAdmin)
admin.site.register(JobOffer, JobOfferAdmin)
admin.site.register(Event)

# Check if ChatGroup and Message are already registered
if not admin.site.is_registered(ChatGroup):
    admin.site.register(ChatGroup, ChatGroupAdmin)

if not admin.site.is_registered(Message):
    admin.site.register(Message, MessageAdmin)