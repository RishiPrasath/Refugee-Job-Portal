from django.dispatch import Signal

# Define signals for each event
create_interview = Signal()
cancel_interview = Signal()
create_job_posting = Signal()
apply_for_job = Signal()
create_job_offer = Signal()
approve_job_offer = Signal()
reject_job_offer = Signal()
reject_candidate = Signal()
approve_candidate = Signal()
candidate_profile_update = Signal()
employer_profile_update = Signal()
create_candidate = Signal()
create_employer = Signal()
message_sent = Signal()