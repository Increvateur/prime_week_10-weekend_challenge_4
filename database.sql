CREATE TABLE IF NOT EXISTS todo_list
    (id SERIAL NOT NULL, task character varying(255) NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    CONSTRAINT todo_list_pkey PRIMARY KEY (id));
