-- BoiHub — Fase 2: Limpeza de dados fictícios (soft launch)
--
-- Remove todos os mocks de catálogo inseridos por supabase/seed.sql.
-- Mantém o schema intacto. Tabelas ficam vazias até cadastros reais.
--
-- ATENÇÃO: este script remove veterinários, motoristas, lojas, suplementos
-- e produtos de saúde. Se houver dados REAIS já cadastrados, NÃO rode antes
-- de fazer backup. Hoje (2026-05-20) só existem mocks, então é seguro.
--
-- Profiles e dados de usuários autenticados NÃO são tocados.

BEGIN;

DELETE FROM public.produtos_saude;
DELETE FROM public.suplementos;
DELETE FROM public.lojas;
DELETE FROM public.motoristas;
DELETE FROM public.veterinarios;

-- Não há fretes nem consultas de mocks (eles dependem de profile.id real),
-- mas se houver órfãos referenciando vet/motorista deletado, ficam com FK
-- nula. Isso é tratado no schema (motorista_id e veterinario_id nullable).

COMMIT;
