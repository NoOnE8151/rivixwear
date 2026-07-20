   const fetchProduct = async (productId) => {
    try {
      console.log('fetching product for the id', productId)
      const response = await fetch("/api/public/shop/product/get", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });
      const res = await response.json();
      return res.products
    } catch(error) {
      console.log(error);
      return;
    }
    };

    export default fetchProduct;