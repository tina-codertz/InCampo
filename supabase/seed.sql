-- Incampo seed data (run after schema.sql)

insert into public.announcements (
  id, author_name, author_initials, author_color, is_urgent, category,
  title, body, tags, likes, comments, image_url, created_at
) values
  ('1', 'Admin Office', 'AO', '#8B5CF6', true, 'Announcement',
   'Campus Library Extended Hours',
   'The main library will be open 24/7 during finals week starting December 10th. Additional study rooms are available.',
   array['Academic', 'Library'], 142, 18,
   'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
   now() - interval '2 minutes'),
  ('2', 'CS Department', 'CS', '#6366F1', false, 'Announcement',
   'Spring Registration Opens Monday',
   'Course registration for Spring 2026 opens at 8:00 AM. Check your advising hold status before enrolling.',
   array['Academic', 'Registration'], 89, 12,
   'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
   now() - interval '1 hour'),
  ('3', 'Student Life', 'SL', '#34D399', false, 'Event',
   'Green Campus Week Starts Tomorrow',
   'Join sustainability workshops, campus clean-ups, and the zero-waste challenge. Prizes for top participating clubs.',
   array['GreenCampus', 'Social'], 56, 9,
   'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
   now() - interval '3 hours'),
  ('4', 'Research Office', 'RO', '#F59E0B', false, 'Opportunity',
   'Undergraduate Research Grant Applications Open',
   'Apply for up to $2,500 in funding for faculty-mentored research projects. Deadline: January 15.',
   array['ResearchGrant', 'Academic'], 73, 14, null,
   now() - interval '5 hours'),
  ('5', 'Hackathon Committee', 'HC', '#60A5FA', false, 'Event',
   'HackathonUni26 Team Registration Now Live',
   'Form teams of 2–4 students. Workshops on AI tooling and product design run all week before the main event.',
   array['HackathonUni26', 'Tech'], 201, 42, null,
   now() - interval '1 day')
on conflict (id) do nothing;

insert into public.events (
  id, title, category, event_date, event_time, location, attendees,
  host, description, image_url, featured, created_at
) values
  ('1', 'Annual Hackathon 2026', 'Academic', 'Dec 14–16', '6:00 PM',
   'Engineering Hub, Room 301', 234, 'CS Department',
   'Build innovative projects over 48 hours with mentors, workshops, and prizes. Teams of 2–4 students. Meals and swag provided.',
   'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', true, now()),
  ('2', 'Winter Art Exhibition Opening', 'Arts', 'Dec 12', '7:00 PM',
   'Arts Center Gallery', 67, 'Fine Arts Society',
   'Celebrate student and faculty work across painting, sculpture, and digital media. Light refreshments and live acoustic set.',
   'https://images.unsplash.com/photo-1460661419345-08bfab32645f?w=400&q=80', false, now()),
  ('3', 'Intramural Basketball Finals', 'Sports', 'Dec 18', '5:30 PM',
   'Campus Recreation Center', 156, 'Campus Athletics',
   'Championship game between the Engineers and the Wildcats. Free entry for students with campus ID.',
   'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', true, now()),
  ('4', 'Startup Pitch Night', 'Social', 'Dec 20', '6:30 PM',
   'Innovation Lab, Building C', 98, 'Entrepreneurship Hub',
   'Watch student founders pitch their ventures to alumni judges. Networking mixer follows the presentations.',
   'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', false, now()),
  ('5', 'Mindfulness & Finals Prep Workshop', 'Academic', 'Dec 11', '4:00 PM',
   'Wellness Center, Room 102', 44, 'Student Wellness',
   'Guided meditation, study planning strategies, and stress-management tools to help you finish the semester strong.',
   'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', false, now())
on conflict (id) do nothing;

insert into public.clubs (
  id, name, category, members, description, meeting_time, location, image_url, featured, created_at
) values
  ('1', 'AI & Machine Learning Society', 'Tech', 312,
   'Weekly paper readings, hack nights, and guest lectures from industry researchers. Open to all skill levels.',
   'Wednesdays · 6:00 PM', 'CS Building, Room 204',
   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', true, now()),
  ('2', 'Entrepreneurship Hub', 'Academic', 228,
   'Connect with founders, mentors, and investors. Monthly pitch nights and startup studio sessions.',
   'Thursdays · 5:30 PM', 'Innovation Lab',
   'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', true, now()),
  ('3', 'Esports & Gaming Society', 'Social', 445,
   'Competitive teams, casual game nights, and watch parties for major tournaments across campus.',
   'Fridays · 7:00 PM', 'Student Union Game Lounge',
   'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', true, now()),
  ('4', 'Campus Photography Club', 'Arts', 156,
   'Photo walks, editing workshops, and semester gallery showcases for students who love visual storytelling.',
   'Saturdays · 10:00 AM', 'Arts Center Studio B',
   'https://images.unsplash.com/photo-1452587925148-ce544e77eee7?w=800&q=80', false, now()),
  ('5', 'Intramural Soccer League', 'Sports', 189,
   'Casual and competitive soccer teams with weekly matches and end-of-season tournament playoffs.',
   'Tuesdays · 4:30 PM', 'North Field',
   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', false, now()),
  ('6', 'Debate & Public Speaking Society', 'Academic', 94,
   'Practice argumentation, compete in regional tournaments, and build confidence speaking in front of crowds.',
   'Mondays · 6:30 PM', 'Humanities Hall 112',
   'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', false, now())
on conflict (id) do nothing;

-- Notifications are user-scoped. Broadcast demo rows use user_id = null.

insert into public.notifications (
  id, user_id, type, title, body, section, is_read, created_at
) values
  ('1', null, 'like', 'Sarah Chen', 'liked your comment on Campus Library Extended Hours', 'TODAY', false, now() - interval '2 minutes'),
  ('2', null, 'reply', 'Marcus Lee', 'replied to your comment: "Thanks for sharing this!"', 'TODAY', false, now() - interval '15 minutes'),
  ('3', null, 'event', 'CS Department', 'Hackathon 2026 registration closes in 2 days', 'TODAY', false, now() - interval '1 hour'),
  ('4', null, 'club', 'Entrepreneurship Hub', 'posted a new update about the startup pitch night', 'TODAY', false, now() - interval '3 hours'),
  ('5', null, 'event', 'Campus Events', 'Winter Art Exhibition Opening starts tomorrow at 7 PM', 'YESTERDAY', true, now() - interval '1 day'),
  ('6', null, 'like', 'Priya Nair', 'liked your post about Spring Registration', 'YESTERDAY', true, now() - interval '1 day'),
  ('7', null, 'club', 'AI & Machine Learning Society', 'shared notes from this week''s paper reading session', 'THIS WEEK', true, now() - interval '3 days'),
  ('8', null, 'reply', 'James Ortiz', 'replied to your comment: "See you at the hackathon!"', 'THIS WEEK', true, now() - interval '4 days')
on conflict (id) do nothing;
