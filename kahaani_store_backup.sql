--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.otp_codes DROP CONSTRAINT IF EXISTS otp_codes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_user_id_fkey;
DROP INDEX IF EXISTS public.verificationtokens_token_key;
DROP INDEX IF EXISTS public.verificationtokens_identifier_token_key;
DROP INDEX IF EXISTS public.users_phone_key;
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.sessions_session_token_key;
DROP INDEX IF EXISTS public.admins_username_key;
DROP INDEX IF EXISTS public.admins_email_key;
DROP INDEX IF EXISTS public.accounts_provider_provider_account_id_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.otp_codes DROP CONSTRAINT IF EXISTS otp_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.admins DROP CONSTRAINT IF EXISTS admins_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_pkey;
DROP TABLE IF EXISTS public.verificationtokens;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.otp_codes;
DROP TABLE IF EXISTS public.admins;
DROP TABLE IF EXISTS public.accounts;
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."AdminRole";
--
-- Name: AdminRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AdminRole" AS ENUM (
    'ADMIN',
    'SUPER_ADMIN'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'PREMIUM_USER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    "isActive" boolean DEFAULT true NOT NULL,
    role public."AdminRole" DEFAULT 'ADMIN'::public."AdminRole" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_codes (
    id text NOT NULL,
    phone text NOT NULL,
    code text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    user_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    session_token text NOT NULL,
    user_id text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text,
    email_verified timestamp(3) without time zone,
    image text,
    phone text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: verificationtokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verificationtokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, username, email, password, name, "isActive", role, created_at, updated_at) FROM stdin;
cmck7ysbk00001lwyynngmj1w	admin@kahaanibyrangasuta.com	admin@kahaanibyrangasuta.com	$2b$12$tZmoRk2elsxDfN.R4QzYme3oitEsXxkcWxA.DMjGCkhZoznyn8jJW	Kahaani Admin	t	SUPER_ADMIN	2025-07-01 07:41:41.984	2025-07-01 07:41:41.984
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_codes (id, phone, code, expires_at, verified, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, email_verified, image, phone, role, "isActive", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: verificationtokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verificationtokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_provider_account_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX accounts_provider_provider_account_id_key ON public.accounts USING btree (provider, provider_account_id);


--
-- Name: admins_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);


--
-- Name: admins_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_phone_key ON public.users USING btree (phone);


--
-- Name: verificationtokens_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verificationtokens_identifier_token_key ON public.verificationtokens USING btree (identifier, token);


--
-- Name: verificationtokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verificationtokens_token_key ON public.verificationtokens USING btree (token);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: otp_codes otp_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

