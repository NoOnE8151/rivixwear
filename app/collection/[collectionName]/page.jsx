'use client'
import React, { use, useEffect, useState } from "react";
import ProductCard from "@/app/components/shop/ProductCard";
import fetchCollection from "@/utils/shop/product/fetchCollection";
import Navbar from "@/app/components/Navbar";

const Collection = ({ params }) => {

  const { collectionName } = use(params);
  const [collection, setCollection] = useState();

  useEffect(() => {
    fetchCollection(collectionName)
    .then((collection) => {
        setCollection(collection);
        console.log("fetched collection in promise", collection);
      })
      .catch(console.error);
  },[])

  return (
    <div>
      <Navbar />
    <div className="w-screen h-screen flex flex-col md:grid md:grid-cols-4 gap-10 px-10 md:px-22 py-10">
      {
        collection?.map((product) => {
          return (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          )
        })
      }
    </div>
      </div>
  );
};

export default Collection;
