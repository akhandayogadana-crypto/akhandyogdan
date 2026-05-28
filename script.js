// Gallery Data - LocalStorage से लोड होगा
let galleryImages = JSON.parse(localStorage.getItem('galleryImages')) || [
    {url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400', title: 'शिक्षा अभियान'},
    {url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400', title: 'स्वास्थ्य शिविर'},
    {url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400', title: 'वृक्षारोपण'}
    {file:///F:/ngo%20photo/001%20(4).jpeg?w=400',title: 'सम्मान समारोह'}
];

// Gallery Load करना
function loadGallery() {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '';
    galleryImages.forEach((img, index) => {
        container.innerHTML += `
            <div class="gallery-item">
                <img src="${img.url}" alt="${img.title}">
                <p>${img.title}</p>
            </div>
        `;
    });
}

// Razorpay Payment
function payWithRazorpay(amount) {
    // Razorpay Key ID डालनी है यहाँ - test key use करो पहले
    const options = {
        "key": "rzp_test_XXXXXXXXXX", // अपनी Razorpay Key डालो
        "amount": amount * 100, // paise में
        "currency": "INR",
        "name": "Akhand Yogdan Association",
        "description": "Donation",
        "image": "https://via.placeholder.com/100x100/2E7D32/ffffff?text=AYA",
        "handler": function (response){
            alert('धन्यवाद! Payment Successful. Payment ID: ' + response.razorpay_payment_id);
            // यहाँ backend पर payment save कर सकते हो
        },
        "prefill": {
            "name": "",
            "email": "",
            "contact": ""
        },
        "notes": {
            "address": "Sultanpur NGO Donation"
        },
        "theme": {
            "color": "#2E7D32"
        }
    };
    const rzp = new Razorpay(options);
    rzp.open();
}

function payCustom() {
    const amount = document.getElementById('customAmount').value;
    if(amount && amount > 0) {
        payWithRazorpay(amount);
    } else {
        alert('कृपया सही राशि डालें');
    }
}

function copyUPI() {
    const upiText = document.getElementById('upi-text').innerText;
    navigator.clipboard.writeText(upiText).then(() => {
        alert('UPI ID कॉपी हो गई: ' + upiText);
    });
}

function submitForm(event) {
    event.preventDefault();
    alert('धन्यवाद! आपका संदेश मिल गया है। हम जल्दी संपर्क करेंगे।');
    event.target.reset();
}

// Admin Panel Functions
function showAdminLogin() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdmin() {
    document.getElementById('adminModal').style.display = 'none';
}

function adminLogin() {
    const pass = document.getElementById('adminPass').value;
    if(pass === 'admin123') { // Password बदल देना
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminGallery();
    } else {
        alert('गलत Password');
    }
}

function adminLogout() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminPass').value = '';
}

function addGalleryImage() {
    const url = document.getElementById('imgUrl').value;
    const title = document.getElementById('imgTitle').value;
    if(url && title) {
        galleryImages.push({url, title});
        localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
        loadGallery();
        loadAdminGallery();
        document.getElementById('imgUrl').value = '';
        document.getElementById('imgTitle').value = '';
        alert('फोटो जोड़ दी गई!');
    }
}

function loadAdminGallery() {
    const container = document.getElementById('adminGalleryList');
    container.innerHTML = '';
    galleryImages.forEach((img, index) => {
        container.innerHTML += `
            <div class="admin-gallery-item">
                <img src="${img.url}" alt="${img.title}">
                <span>${img.title}</span>
                <button onclick="deleteImage(${index})" style="background:red;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>
            </div>
        `;
    });
}

function deleteImage(index) {
    if(confirm('क्या आप ये फोटो हटाना चाहते हैं?')) {
        galleryImages.splice(index, 1);
        localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
        loadGallery();
        loadAdminGallery();
    }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Page Load पर Gallery लोड करो
window.onload = function() {
    loadGallery();
}

// Modal बाहर click करने पर बंद
window.onclick = function(event) {
    const modal = document.getElementById('adminModal');
    if (event.target == modal) {
        closeAdmin();
    }
}
