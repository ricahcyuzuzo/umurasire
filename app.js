const firebaseConfig = {
    apiKey: "AIzaSyBe4xOruz9h_ac-ZC6QbWJ1uqzcZZUNfeg",
    authDomain: "solarshop-e86ad.firebaseapp.com",
    projectId: "solarshop-e86ad",
    storageBucket: "solarshop-e86ad.appspot.com",
    messagingSenderId: "578561483387",
    appId: "1:578561483387:web:833c3926b184611a07b8de",
    measurementId: "G-2J2C3SW8GY"
  };
  
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const brandsRef = db.collection('brands');
const usersRef = db.collection('users');
const ordersRef = db.collection('orders');
const stockRef = db.collection('stock');

const storeId = (id) => {
    localStorage.setItem('Id', id);
    console.log(localStorage.getItem('Id'))
}

const storeIds = (id) => {
    brandsRef.doc(id).collection('products').onSnapshot((snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
        }))
    
        const output = document.getElementById('view-products');
        output.innerHTML = data.map((item, idx) => {
            return (`
                    <tr><td><img src="${item.data.image}" style="width: 50px; height: 50px;" /></td>
                    <td>${item.data.name}</td>
                    <td>${item.data.capacity}</td>
                    <td>${item.data.description}</td>
                    <td><ul>${item.data.appliances.map((item, idx) => {
                        return (`
                            <li><img src="${item.image}" style="width: 20px; height: 20px;" /> ${item.name}</li>
                        `)
                    })}</ul></td></tr>
            `);
        })
    })
}



brandsRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }))

    document.getElementById('brand').innerText= data.length;

    const output = document.getElementById('brands');
    output.innerHTML = data.map((item, idx) => {

        

        return (`
            <div style="background-color: rgb(186, 180, 186); border-radius: 20px; padding: 10px; display: flex; justify-content: space-between;">
                <div>
                    <img src="${item.data.image}" style="width: 100px; height: 100px; border-radius: 50px;"> 
                    <span style="font-size: 40px; margin-top: 20px; color: #4478c1;">${item.data.brand}</span>    
                </div>
                <div>
                    <button class="btn btn-primary" style="border-radius: 20px;" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" data-id="${item.id}" id='addProduct' onclick="storeId('${item.id}')" >Add Product</button>
                    <button class="btn btn-primary" style="border-radius: 20px;" data-bs-toggle="modal" data-bs-target="#staticBackdrop2" data-ids="${item.id}" id='viewProduct' onclick="storeIds('${item.id}')" >View Product</button>
                </div>
            </div>
            <div>
            </div>
        `)
    })
    console.log(data)

});



usersRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }))

    document.getElementById('users').innerText=data.length;

    const output = document.getElementById('table');
    output.innerHTML = data.map((item, idx) => {

        

        return (`
            <tr>
                <td>${item.data.names}</td>
                <td>${item.data.email}</td>
            </tr>
        `)
    })
    console.log(data)

});

ordersRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }))

    document.getElementById('orders').innerText=data.length;

    const output = document.getElementById('tableOrders');
    output.innerHTML = data.map((item, idx) => {

        

        return (`
            <tr>
            <td>${item.data.cutomerNames}</td>
            <td>${item.data.customerEmail}</td>
            <td>${item.data.phoneNumber}</td>
                <td>${item.data.customerAddress}</td>
                <td>${item.data.amount}</td>
                <td>${item.data.status}</td>
            </tr>
        `)
    })
    console.log(data)

});

stockRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }))

    document.getElementById('stock').innerText = data[0].data.stock;


});


brandsRef.doc(localStorage.getItem('Id')).collection('products').onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
    }))

    const output = document.getElementById('view-products');
    output.innerHTML = data.map((item, idx) => {
        return (`
                
        `);
    })
})


const addBrandButton = () => {
    const brand = document.getElementById('brandName').value;
    const image = document.getElementById('brandImage').files[0];

    const CLOUDINARY_UPLOAD_PRESET = 'ywxfkdjs';
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    axios.post('https://api.cloudinary.com/v1_1/agri-rwanda/image/upload', formData)
        .then(res => {
            brandsRef.add({
                brand,
                image: res.data.secure_url
            }).then(() => {
                alert('Brand have been added');
                window.location.reload();
            })
        }).catch(err => console.log('error', err.response))   

}

const addAppliances = async () => {
    const applianceName = document.getElementById('applianceName').value;
    const applianceImage = document.getElementById('applianceImage').files[0];
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const capacity = document.getElementById('capacity').value;
    const image = document.getElementById('productImage').files[0];

    const CLOUDINARY_UPLOAD_PRESET = 'ywxfkdjs';
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const result = await axios.post('https://api.cloudinary.com/v1_1/agri-rwanda/image/upload', formData); 
    const productImageUrl = result.data.secure_url;

    const formDatas = new FormData();
    formDatas.append('file', applianceImage);
    formDatas.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post('https://api.cloudinary.com/v1_1/agri-rwanda/image/upload', formDatas); 
    const applianceImageUrl = res.data.secure_url;
    
    brandsRef.doc(localStorage.getItem('Id')).collection('products').add({
        capacity,
        description,
        image: productImageUrl,
        name,
        appliances: [
            {
                name: applianceName,
                image: applianceImageUrl
            }
        ]
    }).then(() => {
        alert('Product added successful');
        window.location.reload();
    })
}


const addProductButton = () => {

}