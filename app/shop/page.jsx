"use client";
import React, { useEffect, useState } from "react";
import fetchProduct from "@/utils/shop/product/fetchProduct";
import ProductCard from "../components/shop/ProductCard";
import Navbar from "../components/Navbar";

const Shop = () => {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    fetchProduct()
      .then((products) => {
        setProductList(products);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <div className="md:grid md:grid-cols-4 flex flex-col md:px-22 md:py-10 p-10 gap-10">
        {productList?.map((product) => {
            return <div key={product._id}>
            <ProductCard product={product} ></ProductCard>
            </div>
        })
        }
      </div>
    </div>
  );
};

export default Shop;
