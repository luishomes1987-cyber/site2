-- Insert initial products
INSERT INTO products (id, name, price, original_price, image, category, stock) VALUES
  ('1', 'Jordan Retro High', 200, 250, '/jordan-retro-high-sneakers.jpg', 'tenis', 15),
  ('2', 'Nike Dunk Low', 180, 220, '/nike-dunk-low-panda-sneakers.jpg', 'tenis', 20),
  ('3', 'Yeezy Boost 350', 220, 280, '/yeezy-boost-350-zebra-sneakers.jpg', 'tenis', 10),
  ('4', 'AirPods Pro', 249, 299, '/apple-airpods-pro-white.jpg', 'tecnologia', 30),
  ('5', 'AirPods Max Silver', 549, 599, '/apple-airpods-max-silver-headphones.jpg', 'tecnologia', 8),
  ('6', 'Vape Premium', 89, 120, '/modern-premium-vape-device.jpg', 'vapes', 25),
  ('7', 'Vape Descartável', 45, 60, '/colorful-disposable-vape-pen.jpg', 'vapes', 50),
  ('8', 'Hoodie Oversized', 120, 150, '/black-oversized-hoodie-streetwear.jpg', 'roupas', 18),
  ('9', 'Cargo Pants Bege', 95, 130, '/beige-cargo-pants-streetwear.jpg', 'roupas', 22)
ON CONFLICT (id) DO NOTHING;
