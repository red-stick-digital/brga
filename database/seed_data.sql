-- Initial data for Events and Announcements
-- Run this after creating the schema and setting up your admin user

-- Insert sample announcements based on your current content
INSERT INTO announcements (title, content, type, display_order) VALUES
(
    'Welcome Our New Intergroup',
    'Welcome our new Intergroup members that will be starting in November. Please see the members only page for names and contact information.',
    'welcome',
    1
),
(
    'New Alexandria Meeting',
    'There are a group of gamblers in the Alexandria, LA area that are going to try to get their meeting going again. Please join in supporting them if you can. First meeting has been pushed back to November. Stay tuned for date and location.',
    'general',
    2
),
(
    'New Blue Book Meeting',
    'The Sunday night meeting is starting a new Blue Book meeting. The meeting will be on the 2nd Sundays of the month, still staring at 7pm as usual. Come join us on September 21st to dig deeper into our GA Blue Book.',
    'general',
    3
);

-- Insert recurring meetings/events
INSERT INTO events (title, description, event_type, location, address, start_time, end_time, is_recurring, recurrence_pattern) VALUES
(
    'Baton Rouge Intergroup Meeting',
    'Join in helping the Baton Rouge and Hammond area recover together.',
    'intergroup',
    'Small Building on the Right Side of the Parking Lot',
    '9755 Goodwood Blvd.
Baton Rouge, LA 70815',
    '18:30:00',
    '19:00:00',
    true,
    '2nd Tuesday of Every Month'
),
(
    'Speaker Meeting',
    'Please come and listen to one of our members tell their story of recovery.',
    'speaker',
    'Grace Baptist Church, Building on the Left Side of the Church, 1st Floor',
    '630 Richland Ave.
Baton Rouge, LA 70806',
    '18:30:00',
    '19:30:00',
    true,
    '1st Wednesday of Every Month'
),
(
    'Recovery Step Meeting',
    '',
    'step_meeting',
    'Broadmoor United Methodist Church, Community Ministries Building on the Back Side of the Grounds',
    '10230 Mollylea Dr.
Baton Rouge, LA 70815',
    '19:00:00',
    '20:00:00',
    true,
    '1st Thursday of Every Month'
),
(
    'Unity Step Meeting',
    '',
    'step_meeting',
    'Blackwater United Methodist Church, Meeting Room Building Behind the Church',
    '10000 Blackwater Rd.
Baker, LA 70714',
    '12:00:00',
    '13:00:00',
    true,
    '1st Friday of Every Month'
),
(
    'GA Blue Book Study Meeting - Gonzales',
    '',
    'blue_book',
    'Stepping Stones Clubhouse',
    '1027 N. Burnside Dr.
Gonzales, LA 70737',
    '19:00:00',
    '20:00:00',
    true,
    '2nd Sunday of Every Month'
),
(
    'GA Blue Book Study Meeting - Baker',
    '',
    'blue_book',
    'Blackwater United Methodist Church, Meeting Room Building Behind the Church',
    '10000 Blackwater Rd.
Baker, LA 70714',
    '12:00:00',
    '13:00:00',
    true,
    '3rd Friday of Every Month'
),
(
    'GA Blue Book Study Meeting - Denham Springs',
    '',
    'blue_book',
    'Luke 10:27 Church, Second Building on the Left - Up the Wheelchair Ramp in Back',
    '536 Centerville St. NE
Denham Springs, LA 70726',
    '10:00:00',
    '11:00:00',
    true,
    'Fourth Saturday of Every Month'
);