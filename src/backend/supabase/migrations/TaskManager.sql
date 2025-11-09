-- 1. Create users table
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    phone text not null,
    email text not null unique,
    password text not null
);

-- 2. Insert 3 test users (fixed UUIDs)
insert into users (id, name, phone, email, password) values
('0d1d6d11-62b9-411c-a9a2-295d7c222c66', 'Alice', '+94771234567', 'alice@gmail.com', 'Alice123'),
('6c1d15d3-709c-4a91-af56-e1bee1f14730', 'Bob', '+94771234568', 'bob@gmail.com', 'Bob123'),
('27e74b44-b6b7-4b29-a77f-21693198dd74', 'Carol', '+94771234569', 'carol@gmail.com', 'Carol123');

-- 3. Create tasks table
create table if not exists tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    title text not null,
    is_completed boolean default false,
    inserted_at timestamptz default now()
);

-- 4. Insert 3 tasks for each user
insert into tasks (user_id, title, is_completed) values
-- Alice's tasks
('0d1d6d11-62b9-411c-a9a2-295d7c222c66', 'Buy groceries', false),
('0d1d6d11-62b9-411c-a9a2-295d7c222c66', 'Read a book', true),
('0d1d6d11-62b9-411c-a9a2-295d7c222c66', 'Workout', false),

-- Bob's tasks
('6c1d15d3-709c-4a91-af56-e1bee1f14730', 'Complete project report', false),
('6c1d15d3-709c-4a91-af56-e1bee1f14730', 'Call mom', true),
('6c1d15d3-709c-4a91-af56-e1bee1f14730', 'Plan weekend trip', false),

-- Carol's tasks
('27e74b44-b6b7-4b29-a77f-21693198dd74', 'Submit assignment', true),
('27e74b44-b6b7-4b29-a77f-21693198dd74', 'Clean room', false),
('27e74b44-b6b7-4b29-a77f-21693198dd74', 'Meditation', false);
