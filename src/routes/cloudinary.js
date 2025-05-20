const CLOUD_NAME = "dwbyocbug";
const UPLOAD_PRESET = "unsigned_preset";
const API_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

export const uploadToCloudinary = async (fileBlob, resourceType = "image", context = {}) => {
  const formData = new FormData();
  formData.append("file", fileBlob);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("tags", "snapshot,autocaption");

  const contextString = Object.entries(context)
    .map(([k, v]) => `${k}=${v}`)
    .join("|");
  if (contextString) formData.append("context", contextString);

  const res = await fetch(`${API_BASE_URL}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  const caption = data?.info?.detection?.captioning?.data?.caption;
  if (caption) {
    const updateForm = new FormData();
    updateForm.append("context", `caption=${caption}`);
    updateForm.append("tags", "autocaption,snapshot");

    await fetch(`${API_BASE_URL}/${resourceType}/update/${data.public_id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa("your_api_key:your_api_secret"),
      },
      body: updateForm,
    });
  }

  return data;
};

export const fetchCloudinaryMedia = async (tag = "snapshot") => {
  const res = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`
  );

  if (!res.ok) throw new Error(`Failed to fetch media with tag "${tag}"`);

  const data = await res.json();

  const imageResults = data.resources.map((item) => ({
    ...item,
    resource_type: "image",
    secure_url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`,
  }));

  const videoRes = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/video/list/${tag}.json`
  );

  const videoResults = videoRes.ok
    ? (await videoRes.json()).resources.map((item) => ({
        ...item,
        resource_type: "video",
        secure_url: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${item.public_id}.${item.format}`,
      }))
    : [];

  return [...imageResults, ...videoResults].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
};
