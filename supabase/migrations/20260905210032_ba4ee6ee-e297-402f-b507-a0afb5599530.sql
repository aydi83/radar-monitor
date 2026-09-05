create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('radar-run-monitor-checks') where exists (select 1 from cron.job where jobname = 'radar-run-monitor-checks');

select cron.schedule(
  'radar-run-monitor-checks',
  '0 */6 * * *',
  $$
  select net.http_post(
    url := 'https://project--6e55e80e-0289-4246-a196-e3906996791f-dev.lovable.app/api/public/run-monitor-checks',
    headers := '{"Content-Type":"application/json","apikey":"sb_publishable_YdnmgMM0DoWfo1u6UUXn9A_SW4k484B"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);