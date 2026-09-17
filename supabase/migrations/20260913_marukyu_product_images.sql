-- Matcha Archive V9: update only legacy/missing image URLs.
-- Custom Admin/Cloudinary image URLs are intentionally preserved.

update public.tea_products set image_url = '/images/tea/marukyu/isuzu.jpg'
where slug = 'isuzu' and (image_url is null or image_url like '/images/tea/%.svg');

update public.tea_products set image_url = '/images/tea/marukyu/chigi-no-shiro.jpg'
where slug = 'chigi-no-shiro' and (image_url is null or image_url like '/images/tea/%.svg');

update public.tea_products set image_url = '/images/tea/marukyu/yugen.jpg'
where slug = 'yugen' and (image_url is null or image_url like '/images/tea/%.svg');

update public.tea_products set image_url = '/images/tea/marukyu/wako.jpg'
where slug = 'wako-marukyu-koyamaen' and (image_url is null or image_url like '/images/tea/%.svg');

update public.tea_products set image_url = '/images/tea/marukyu/kinrin.jpg'
where slug = 'kinrin' and (image_url is null or image_url like '/images/tea/%.svg');

update public.tea_products set image_url = '/images/tea/marukyu/unkaku.jpg'
where slug = 'unkaku' and (image_url is null or image_url like '/images/tea/%.svg');