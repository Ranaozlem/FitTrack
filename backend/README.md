# FitTrack - TaskFlow Backend API

Node.js ve Express.js ile geliştirilmiş
sağlık ve spor görev yönetim sistemidir.

## Teknolojiler
- Node.js
- Express.js
- JavaScript
- JSON
- Postman

## Kurulum ve Çalıştırma
1. Bilgisayarınızda Node.js ve npm kurulu olmalıdır. Terminalde kontrol edin:

```bash
node --version
npm --version
```

2. GitHub'dan projeyi ZIP olarak indirip çıkarın veya Git kuruluysa klonlayın:

```bash
git clone https://github.com/Ranaozlem/FitTrack.git
```

3. Terminalde projenin backend klasörünü açın. Klonladıysanız:

```bash
cd FitTrack/backend
```

ZIP indirdiyseniz çıkardığınız proje klasöründeki backend klasöründe terminal açın.

4. Gerekli paketleri yükleyin:

```bash
npm install
```

5. Sunucuyu başlatın:

```bash
node server.js
```

Terminalde "FitTrack API: http://localhost:3000" mesajı görünür.
Sunucu çalışırken terminali açık tutun.

6. Tarayıcıda http://localhost:3000/tasks adresini açın veya Postman ile bu adrese GET isteği gönderin. Görevler JSON olarak listelenir; hiç görev yoksa [] döner.

7. Sunucuyu durdurmak için terminalde Ctrl+C tuşlarına basın. Yeniden başlatmak için backend klasöründe node server.js komutunu çalıştırın.

Veriler backend/data/tasks.json dosyasında saklanır. Klasör ve dosya yoksa sunucu bunları otomatik oluşturur. Ayrı bir veritabanı kurulumu veya .env dosyası gerekmez.

## API
- GET /tasks
- GET /tasks/:id
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Özellikler
- Görev CRUD işlemleri
- Logger middleware
- JSON dosyasında veri saklama

## Testler
5 API endpoint'i Postman ile test edilmiştir.
Test görüntüleri screenshots klasöründedir.

