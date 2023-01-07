const coursesContainer = document.querySelector(".courses-container");
const cartIcon = document.querySelectorAll(".cart-icon");
const closeCart = document.querySelector(".close-cart");
const cartSection = document.querySelector(".cart-section");
const cartCourseContainer = document.querySelector(".cart-course-container");
const courseCount = document.querySelectorAll(".count");
let count = 0;
const checkoutContainer = document.querySelector(".checkout-container");
let totalPrices = 0;
const hamburgerIcon = document.querySelector(".hamburger-menu > i");
const hamburgerMenu = document.querySelector(".nav-links ul");
const hamburgerMenuCloseIcon = document.querySelector(".fa-xmark-circle");
let cartIconClicked = false;

class Ui {
  async getCourseData() {
    var courseData = await fetch("./index.json");
    var data = await courseData.json();
    var dataArr = data.items;
    return dataArr;
  }
  displayCourses() {
    var coursesArr = this.getCourseData();
    coursesArr.then((result) => {
      result.map((courseObj) => {
        coursesContainer.innerHTML += `<div class="courses" data-id = "${courseObj.sys.id}">
            <div class="course-img-container">
              <img src="${courseObj.fields.images.field.file.url}" alt="${courseObj.fields.title} image" />
            </div>
            <div class="course-header">
              <h4>${courseObj.fields.title}</h4>
            </div>
            <div class="course-pricing"> <p class="price">$${courseObj.fields.price}</p> </div>
            <span class="add-course-tag"
              >
              <i class="fa-solid fa-shopping-cart">Add To Cart</i></span
            >
          </div>`;
      });
      var cartInterface = new cartUi();
      cartInterface.addCourse();
    });
  }
  setCartSection() {
    if (cartIconClicked) {
      if (document.body.getBoundingClientRect().width < 568) {
        cartSection.style.left = "0%";
        cartSection.style.width = "100%";
        cartSection.style.opacity = 1;
      } else if (document.body.getBoundingClientRect().width < 1024) {
        cartSection.style.left = "50%";
        cartSection.style.width = "50%";
        cartSection.style.opacity = 1;
      } else {
        cartSection.style.width = "30%";
        cartSection.style.left = "70%";
        cartSection.style.opacity = 1;
      }
    }
  }
}
var siteUi = new Ui();
siteUi.displayCourses();

closeCart.addEventListener("click", () => {
  cartIconClicked = false;
  cartSection.style.left = "100%";
  cartSection.style.width = "0";
  cartSection.style.opacity = 0;
});
cartIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    cartIconClicked = true;
    siteUi.setCartSection();
  });
});
window.addEventListener("resize", siteUi.setCartSection);
class cartUi {
  addCourse() {
    const addCourseBtns = document.querySelectorAll(".courses .add-course-tag");
    addCourseBtns.forEach((element) => {
      element.parentElement.addEventListener("mouseover", () => {
        if (document.body.getBoundingClientRect().width > 1024) {
          element.style.width = "auto";
          element.firstElementChild.style.overflow = "visible";
          element.style.height = "auto";
          element.style.opacity = "1";
        }
      });
      element.parentElement.addEventListener("mouseout", () => {
        if (document.body.getBoundingClientRect().width > 1024) {
          element.style.width = "0";
          element.firstElementChild.style.overflow = "hidden";
          element.style.height = "0";
          element.style.opacity = "0";
        }
      });
      element.addEventListener("click", () => {
        const newCheckoutContainer = checkoutContainer;
        if (element.firstElementChild.textContent !== "In Cart") {
          element.innerHTML = `<i class="fa-solid fa-shopping-cart">In Cart</i>`;
          var courseImgSrc =
            element.parentElement.firstElementChild.firstElementChild.attributes
              .src.textContent;
          var courseTitle =
            element.parentElement.firstElementChild.nextElementSibling
              .firstElementChild.textContent;
          var coursePrice =
            element.parentElement.firstElementChild.nextElementSibling
              .nextElementSibling.firstElementChild.textContent;
          var courseId = element.parentElement.dataset.id;

          cartCourseContainer.hasChildNodes()
            ? cartCourseContainer.removeChild(checkoutContainer)
            : "";
          cartCourseContainer.innerHTML += `
             <div class="cart-course" data-id="${courseId}">
              <div class="cart-course-img-container"
                ><img src="${courseImgSrc}" alt=""
              /></div>
              <div class="cart-course-title">
                <h4>${courseTitle}</h4>
                <h4>${coursePrice}</h4>
                <div><p class="remove">Remove</p></div>
              </div>
              <div class="course-count">
                <div><i class="fa-solid fa-angle-up"></i></div>
                <p>1</p>
                <div><i class="fa-solid fa-angle-down"></i></div>
              </div>
            </div>
        `;
          count++;
          this.setCount(count);
          totalPrices += parseInt(coursePrice.slice(1, coursePrice.length));
          const totalCost =
            newCheckoutContainer.firstElementChild.firstElementChild;
          totalCost.textContent = "$" + totalPrices;

          cartCourseContainer.appendChild(newCheckoutContainer);
          const clearCart = document.querySelector(".clear-cart");
          clearCart.addEventListener("click", () => {
            const removeBtns = document.querySelectorAll(".remove");
            removeBtns.forEach((btn) => {
              btn.parentElement.parentElement.parentElement.parentElement.removeChild(
                btn.parentElement.parentElement.parentElement
              );

              this.setTagsStatus(addCourseBtns, btn);
              count = 0;
              this.setCount(count);
            });
            cartCourseContainer.innerHTML = "";
          });
        }
        this.removeCourse(addCourseBtns, newCheckoutContainer);
        this.addMoreCourses(newCheckoutContainer);
        this.removeCourses(newCheckoutContainer);
      });
    });
  }
  setTagsStatus(addBtns, btn) {
    addBtns.forEach((button) => {
      if (
        button.parentElement.dataset.id ===
        btn.parentElement.parentElement.parentElement.dataset.id
      ) {
        button.innerHTML = `<i class="fa-solid fa-shopping-cart">Add To Cart</i>`;
      }
    });
  }
  setCount(count) {
    courseCount.forEach((counter) => {
      counter.textContent = count;
    });
  }
  removeCourse(addBtns, container) {
    const removeBtns = document.querySelectorAll(".remove");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.parentElement.parentElement.parentElement.parentElement.removeChild(
          btn.parentElement.parentElement.parentElement
        );
        var coursePriceStr =
          btn.parentElement.previousElementSibling.textContent;
        var coursePriceNum = parseInt(
          coursePriceStr.slice(1, coursePriceStr.length)
        );
        var currentCourseCountStr =
          btn.parentElement.parentElement.nextElementSibling.firstElementChild
            .nextElementSibling.textContent;
        var currentCourseCountNum = parseInt(currentCourseCountStr);
        totalPrices -= coursePriceNum * currentCourseCountNum;
        const totalCost = container.firstElementChild.firstElementChild;
        totalCost.textContent = "$" + totalPrices;
        this.setTagsStatus(addBtns, btn);
        count--;
        this.setCount(count);
      });
    });
  }
  addMoreCourses(container) {
    const increaseBtns = document.querySelectorAll(".fa-angle-up");
    increaseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        var count = parseInt(btn.parentElement.nextElementSibling.textContent);
        var coursePriceStr =
          btn.parentElement.parentElement.previousElementSibling
            .firstElementChild.nextElementSibling.textContent;
        var coursePriceNum = parseInt(
          coursePriceStr.slice(1, coursePriceStr.length)
        );
        totalPrices += coursePriceNum;
        const totalCost = container.firstElementChild.firstElementChild;
        totalCost.textContent = "$" + totalPrices;
        count++;
        btn.parentElement.nextElementSibling.textContent = count;
      });
    });
  }
  removeCourses(container) {
    const increaseBtns = document.querySelectorAll(".fa-angle-down");
    increaseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        var count = parseInt(
          btn.parentElement.previousElementSibling.textContent
        );
        var coursePriceStr =
          btn.parentElement.parentElement.previousElementSibling
            .firstElementChild.nextElementSibling.textContent;
        var coursePriceNum = parseInt(
          coursePriceStr.slice(1, coursePriceStr.length)
        );
        totalPrices -= coursePriceNum;
        const totalCost = container.firstElementChild.firstElementChild;
        totalCost.textContent = "$" + totalPrices;
        count > 0 ? count-- : "";
        btn.parentElement.previousElementSibling.textContent = count;
      });
    });
  }
}
hamburgerIcon.addEventListener("click", () => {
  hamburgerMenu.style.left = "0";
  hamburgerMenu.style.width = "100%";
  hamburgerMenu.style.overflow = "visible";
});
hamburgerMenuCloseIcon.addEventListener("click", () => {
  hamburgerMenu.style.left = "-50%";
  hamburgerMenu.style.width = "0";
  hamburgerMenu.style.overflow = "hidden";
});
