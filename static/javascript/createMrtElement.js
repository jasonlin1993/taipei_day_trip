function createElement(data) {
  let newDiv = document.createElement("div");
  newDiv.className = "container__section__title";

  let id = data.id;
  let link = document.createElement("a");
  link.href = "/attraction/" + id;
  link.className = "attraction-link";

  let img = document.createElement("img");
  img.src = data.images[0];
  img.className = "container__section__title__image";

  let titleName = document.createElement("p");
  titleName.textContent = data.name;
  titleName.className = "container__section__title__text";

  let mrtDiv = document.createElement("div");
  mrtDiv.className = "container__section__titles__mrts";

  let titleMrt = document.createElement("p");
  titleMrt.textContent = data.mrt;
  titleMrt.className = "container__section__titles__mrts--mrt";

  let titleCategory = document.createElement("p");
  titleCategory.textContent = data.category;
  titleCategory.className = "container__section__titles__mrts--category";

  mrtDiv.appendChild(titleMrt);
  mrtDiv.appendChild(titleCategory);

  link.appendChild(img); // 將元素添加到連結內
  link.appendChild(titleName);
  link.appendChild(mrtDiv);

  newDiv.appendChild(link); // 將連結元素添加到新的 div 中
  document.querySelector(".container__section").appendChild(newDiv);
}
