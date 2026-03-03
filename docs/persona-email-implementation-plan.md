# Persona-Based Email System Implementation Plan

## Executive Summary

This document outlines the implementation strategy for a persona-based email system that delivers tailored waitlist confirmation emails to different user types (professionals vs. students/learners).

---

## 1. Current State Analysis

### Existing Data Collection
- **Survey captures**: role, scripts_per_year, current_tool, breakdown_time, is_vip
- **Role options**: Producer, 1st AD, Line Manager, Student, Other
- **Email trigger**: After survey completion via `updateWaitlistSurvey()`

### Current Email System
- Single template for all users
- Sent via Resend API from Supabase Edge Function
- Triggered after survey completion

---

## 2. Database Schema Design

### Add `user_type` Field to Waitlist Table

```sql
-- Migration: add_user_type_to_waitlist.sql

ALTER TABLE waitlist 
ADD COLUMN user_type TEXT 
CHECK (user_type IN ('professional', 'student', 'other'));

-- Backfill existing records based on role
UPDATE waitlist 
SET user_type = CASE 
  WHEN role IN ('Producer', '1st AD', 'Line Manager') THEN 'professional'
  WHEN role = 'Student' THEN 'student'
  ELSE 'other'
END
WHERE user_type IS NULL;

-- Add index for performance
CREATE INDEX idx_waitlist_user_type ON waitlist(user_type);

-- Add comment for documentation
COMMENT ON COLUMN waitlist.user_type IS 'User persona type for email routing: professional, student, or other';
```

### Alternative: Computed Column Approach

```sql
-- If you prefer not to store redundantly, create a view
CREATE OR REPLACE VIEW waitlist_with_persona AS
SELECT 
  *,
  CASE 
    WHEN role IN ('Producer', '1st AD', 'Line Manager') THEN 'professional'
    WHEN role = 'Student' THEN 'student'
    ELSE 'other'
  END AS user_type
FROM waitlist;
```

---

## 3. Email Variant Design

### Professional Email (Current Simplified Version)
**Target**: Producers, 1st ADs, Line Managers  
**Focus**: Time savings, efficiency, ROI  
**Length**: ~80 lines (current optimized version)  
**Tone**: Direct, outcome-driven, respectful of time

**Key Sections**:
1. Welcome + Value (immediate ROI)
2. Built for SA Professionals (credibility)
3. What Works Today (features)
4. What We Need (clear ask)
5. Next Steps (actionable CTA)

### Student/Learner Email
**Target**: Students, film school attendees, early-career  
**Focus**: Learning, collaboration, community  
**Length**: ~120 lines (more emotional, collaborative)  
**Tone**: Encouraging, educational, community-focused

**Key Sections**:
1. Welcome + Learning Opportunity
2. Why We Built This (story-driven)
3. What You'll Learn in Beta
4. Join the Community (co-creator angle)
5. Your Journey Starts Here
6. Optional: Student discount mention

---

## 4. Routing Logic Implementation

### Update Edge Function: `send-waitlist-confirmation`

```typescript
// Determine user type from role
function getUserType(role: string): 'professional' | 'student' | 'other' {
  const professionalRoles = ['Producer', '1st AD', 'Line Manager'];
  
  if (professionalRoles.includes(role)) {
    return 'professional';
  } else if (role === 'Student') {
    return 'student';
  }
  return 'other';
}

// Route to appropriate email template
function getEmailContent(record: WaitlistEntry): { subject: string; html: string } {
  const userType = getUserType(record.role || '');
  
  switch (userType) {
    case 'professional':
      return {
        subject: 'Welcome to SlateOne Beta',
        html: generateProfessionalEmail(record)
      };
    case 'student':
      return {
        subject: 'Welcome to SlateOne Beta - Learn & Build With Us',
        html: generateStudentEmail(record)
      };
    default:
      return {
        subject: 'Welcome to SlateOne Beta',
        html: generateProfessionalEmail(record) // Default to professional
      };
  }
}
```

---

## 5. Frontend Updates (Optional)

### Option A: Implicit Detection (Recommended)
- Use existing survey role field
- No UI changes needed
- Route based on role selection

### Option B: Explicit User Type Selection
- Add user type selector before survey
- "Are you a: [ ] Film Professional [ ] Student/Learner"
- More accurate but adds friction

**Recommendation**: Use Option A (implicit) to reduce friction.

---

## 6. Implementation Steps

### Phase 1: Database (30 min)
1. Create migration file
2. Test migration on development branch
3. Apply to production
4. Verify backfill results

### Phase 2: Email Templates (2 hours)
1. Create `generateStudentEmail()` function
2. Keep existing template as `generateProfessionalEmail()`
3. Design student-specific content
4. Test both templates locally

### Phase 3: Routing Logic (1 hour)
1. Implement `getUserType()` helper
2. Implement `getEmailContent()` router
3. Update Edge Function to use router
4. Add logging for persona tracking

### Phase 4: Testing (1 hour)
1. Test with sample professional data
2. Test with sample student data
3. Verify email delivery for both personas
4. Check analytics/logging

### Phase 5: Monitoring (Ongoing)
1. Track open rates by persona
2. Track conversion rates by persona
3. Gather feedback on email relevance
4. Iterate based on data

---

## 7. Persona Mapping Rules

```typescript
const PERSONA_MAPPING = {
  professional: {
    roles: ['Producer', '1st AD', 'Line Manager'],
    emailLength: 'short',
    focusAreas: ['time_savings', 'efficiency', 'roi'],
    tone: 'direct'
  },
  student: {
    roles: ['Student'],
    emailLength: 'medium',
    focusAreas: ['learning', 'community', 'growth'],
    tone: 'encouraging'
  },
  other: {
    roles: ['Other'],
    emailLength: 'short',
    focusAreas: ['flexibility', 'exploration'],
    tone: 'neutral'
  }
};
```

---

## 8. A/B Testing Strategy (Future)

### Metrics to Track
- Open rate by persona
- Click-through rate (if CTAs added)
- Survey completion rate
- Time to first login
- Feature adoption by persona

### Variants to Test
1. Subject line variations
2. Email length (short vs. medium)
3. CTA placement
4. Personalization level
5. Visual vs. text-heavy

---

## 9. Content Guidelines

### Professional Email
- **Max length**: 100 lines
- **Paragraphs**: 1-2 sentences max
- **Bullet points**: Use for scannability
- **CTAs**: Clear, action-oriented
- **Avoid**: Emotional appeals, lengthy stories

### Student Email
- **Max length**: 150 lines
- **Paragraphs**: 2-3 sentences
- **Story elements**: Brief origin story OK
- **Community focus**: Emphasize collaboration
- **Avoid**: Corporate jargon, hard sells

---

## 10. Success Metrics

### Short-term (Week 1)
- [ ] Migration deployed successfully
- [ ] Both email variants sending correctly
- [ ] No delivery failures
- [ ] Logging captures persona data

### Medium-term (Month 1)
- [ ] Open rates tracked by persona
- [ ] 80%+ open rate for both personas
- [ ] Positive qualitative feedback
- [ ] No unsubscribe spike

### Long-term (Quarter 1)
- [ ] Conversion rate improvement vs. single template
- [ ] Persona-specific feature adoption patterns
- [ ] Refined templates based on data
- [ ] Documented best practices

---

## 11. Rollback Plan

If persona routing causes issues:

1. **Immediate**: Revert Edge Function to single template
2. **Database**: user_type field remains (no harm)
3. **Frontend**: No changes needed (using existing role)
4. **Communication**: No user-facing impact

---

## 12. Cost Analysis

### Development Time
- Database: 30 min
- Email templates: 2 hours
- Routing logic: 1 hour
- Testing: 1 hour
- **Total**: ~5 hours

### Ongoing Costs
- No additional email costs (same volume)
- Minimal maintenance (template updates)
- Analytics tracking (existing tools)

### Expected ROI
- Higher engagement from targeted messaging
- Better conversion rates (estimated +15-25%)
- Reduced unsubscribe rate
- Improved brand perception

---

## 13. Next Actions

1. **Review & Approve**: Stakeholder review of plan
2. **Create Migration**: Write SQL migration file
3. **Design Student Email**: Draft student-specific content
4. **Implement Router**: Update Edge Function
5. **Test Thoroughly**: Both personas, all scenarios
6. **Deploy**: Staged rollout (dev → staging → prod)
7. **Monitor**: Track metrics for 2 weeks
8. **Iterate**: Refine based on data

---

## Appendix A: Sample Student Email Outline

```
Subject: Welcome to SlateOne Beta - Learn & Build With Us

1. Welcome + Learning Opportunity
   - You're joining a community of film students
   - Learn professional breakdown techniques
   - Free during beta

2. Why We Built This
   - Film school didn't teach us efficient breakdowns
   - We want to change that for the next generation
   - Built by people who've been in your shoes

3. What You'll Learn
   - Professional AI-powered breakdown workflows
   - Industry-standard formatting
   - Collaboration with peers
   - Real production techniques

4. Join the Community
   - Your feedback shapes the product
   - Connect with other film students
   - Learn from beta testing experience
   - Build your portfolio with real tools

5. Your Journey Starts Here
   - Login credentials within 24 hours
   - Tutorial videos and guides
   - Student community Discord/Slack
   - Direct support from our team

6. Special Student Benefits
   - Free during beta (always)
   - Educational resources
   - Portfolio-building opportunities
   - Career development support
```

---

## Appendix B: Technical Architecture

```
┌─────────────────┐
│  User Signs Up  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Survey: Role   │ ──► role: "Producer" | "Student" | etc.
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  updateWaitlistSurvey() │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Supabase: waitlist      │
│  + user_type computed    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Edge Function Trigger   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  getUserType(role)       │ ──► "professional" | "student"
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  getEmailContent(type)   │
└────────┬─────────────────┘
         │
         ├──► Professional Template
         │
         └──► Student Template
                   │
                   ▼
            ┌──────────────┐
            │  Resend API  │
            └──────────────┘
```
