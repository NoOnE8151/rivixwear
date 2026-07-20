export default async function fetchCollection(collectionName) {
  try {
    const response = await fetch("/api/public/shop/collection/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectionName }),
    });
    const res = await response.json();
    return res.collection;
  } catch (error) {
    console.log(error);
    return;
  }
}
