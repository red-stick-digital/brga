-- Seed Data for Member Portal
-- Insert the 9 home groups

INSERT INTO home_groups (name, start_time, street_1, street_2, city, state, zip) VALUES
    ('Monday Night', '19:00', '8725 Jefferson Highway', 'Education Building to the Right of the Church', 'Baton Rouge', 'LA', '70809'),
    ('Tuesday Night', '19:00', '9755 Goodwood Blvd.', 'Small Building on the Right Side of the Parking Lot', 'Baton Rouge', 'LA', '70815'),
    ('Wednesday Night', '18:30', '630 Richland Ave.', 'Building on the Left Side of the Church, 1st Floor', 'Baton Rouge', 'LA', '70806'),
    ('Thursday Noon', '12:00', '8725 Jefferson Highway', 'Education Building to the Right of the Church', 'Baton Rouge', 'LA', '70809'),
    ('Thursday Night - Baton Rouge', '19:00', '10230 Mollylea Dr.', 'Community Ministries Building on the Back Side of the Grounds', 'Baton Rouge', 'LA', '70815'),
    ('Thursday Night - Hammond', '19:00', '600 North Oaks Dr.', NULL, 'Hammond', 'LA', '70401'),
    ('Friday Noon', '12:00', '10000 Blackwater Rd.', NULL, 'Baker', 'LA', '70818'),
    ('Saturday Morning', '10:00', '536 Centerville St. NE', NULL, 'Denham Springs', 'LA', '70726'),
    ('Sunday Night', '19:00', '1027 N. Burnside Dr.', NULL, 'Gonzales', 'LA', '70737')
ON CONFLICT (name) DO NOTHING;