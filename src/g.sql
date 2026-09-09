
-- CREATE TABLE store (
--     id BIGSERIAL PRIMARY KEY,
--     product_name VARCHAR(100),
--     price DECIMAL(10, 2),
--     description TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--     );
-- INSERT INTO store (product_name, price, description) 
-- VALUES ('iphone 11', 1500.00, 'A smartphone from Apple, featuring a large display and high-quality camera.'),
--        ('Samsung Galaxy S21', 1200.00, 'A smartphone from Samsung, featuring an AMOLED display and advanced camera.'),
--        ('Xiaomi Mi 11', 800.00, 'A smartphone from Xiaomi, offering excellent performance at an affordable price.'),
--        ('Google Pixel 5', 900.00, 'A smartphone from Google, known for its clean Android experience and great camera.'),
--        ('OnePlus 9', 700.00, 'A smartphone from OnePlus, offering fast performance and a smooth display.'),
--        ('Sony Xperia 1 II', 1100.00, 'A smartphone from Sony, featuring a 4K OLED display and advanced camera features.'),
--        ('Oppo Find X3 Pro', 1000.00, 'A smartphone from Oppo, offering a sleek design and high-quality camera.'),
--        ('Motorola Edge+', 950.00, 'A smartphone from Motorola, featuring a large display and solid performance.'),
--        ('Nokia 8.3 5G', 600.00, 'A smartphone from Nokia, offering 5G connectivity and a clean Android experience.'),
--        ('Asus ROG Phone 5', 1200.00, 'A gaming smartphone from Asus, featuring high refresh rate display and powerful performance.');
select * from store where id<4;