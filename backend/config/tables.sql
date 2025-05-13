CREATE TABLE users
(
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    email        TEXT NOT NULL UNIQUE,
    password     TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE budget_plan
(
    id           SERIAL PRIMARY KEY,
    name         TEXT             NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    description  TEXT,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id      INT              NOT NULL REFERENCES users (id)

);

CREATE TABLE category
(
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL
);
CREATE TABLE expenses
(
    id           SERIAL PRIMARY KEY,
    amount       DOUBLE PRECISION NOT NULL,
    description  TEXT,
    category_id  INT REFERENCES category (id),
    category_name  TEXT REFERENCES category (name),
    date         TIMESTAMPTZ      NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    budget_id    INT REFERENCES budget_plan (id)
);

CREATE TABLE budget_plan_expenses
(
    budget_plan_id INT NOT NULL REFERENCES budget_plan (id) ON DELETE CASCADE,
    expense_id     INT NOT NULL REFERENCES expenses (id) ON DELETE CASCADE,
    PRIMARY KEY (budget_plan_id, expense_id)
);