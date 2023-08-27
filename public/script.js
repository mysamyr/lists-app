window.addEventListener("DOMContentLoaded", async function() {
  async function renderList() {
    const listElement = document.querySelector("ul");
    await fetch("/jars")
      .then(function (data) {
        return data.json()
      })
      .then(function ({ list, error }) {
        if (error) {
          throw new Error(error);
        }
        listElement.innerHTML = list.map(function ({name, capacity, id}) {
          return `<li data-id="${id}">${name} ${capacity}л.<div><span id="edit">~</span><span id="delete">&times;</span></div></li>`;
        }).join("");
      })
      .catch(function (e) {
        console.error(e.message);
        alert(e.message);
      });

    const list = document.querySelectorAll("li");
    list.forEach(function(listItem) {
      listItem.addEventListener("click", async function(e) {
        const id = listItem.dataset.id;
        const name = listItem.textContent.split(" ").slice(0, -1).join(" ");
        if (e.target === listItem) {
          return await openDetails(id);
        }
        if (e.target.id === "edit") {
          return await openRename(id, name);
        }
        if (e.target.id === "delete") {
          return await openDelete(id, name);
        }
      });
    });
  }
  await renderList();
  const dialog = document.querySelector("dialog");
  const addItemBtn = document.querySelector(".add-item");
  function closeDialog() {
    dialog.innerHTML = "";
    dialog.close();
  }
  function validateName(name, oldName) {
    if (!name || name.length < 1 || name.length > 50) {
      return "Назва банки має включати від 0 до 50 символів";
    }
    if (oldName && name === oldName) {
      return "Назва банки має включати від 0 до 50 символів";
    }
  }
  function validateCreationInputs(name, capacity, count) {
    const nameErr = validateName(name);
    if (nameErr) {
      return nameErr;
    }
    if (capacity < 0.07 || capacity > 3) {
      return "Об'єм банки недопустимий";
    }
    if (count < 0) {
      return "Кількість банок не може бути від'ємна";
    }
  }

  async function deleteItem(id) {
    await fetch(`/${id}`, {method: "DELETE"}).then(async function (data) {
        if (!data.ok) {
          const res = await data.json();
          throw new Error(res.error);
        }
      await renderList();
      }).catch(function (e) {
        console.error(e.message);
        alert(e.message);
      });
  }

  async function changeCount(id, isAdd) {
    const countElement = document.getElementById("count");
    const count = +countElement.innerText;
    const newCount = isAdd ? count + 1 : count - 1;

    if (newCount < 0) return alert("Неможливо мати банок менше нуля!");
    await fetch(`/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({count: newCount}),
    }).then(async function (data) {
      if (!data.ok) {
        const res = await data.json();
        throw new Error(res.error);
      }
      countElement.innerText = `${newCount}`;
    }).catch(function (e) {
        console.error(e.message);
        alert(e.message);
      });
  }

  async function openDetails(id) {
    await fetch(`/${id}`)
      .then(function (data) {
        return data.json();
      })
      .then(function (details) {
        if (details.error) {
          throw new Error(details.error);
        }
        dialog.innerHTML = `
          <p><b>${details.name}</b></p>
          <p>Банка: <b>${details.capacity}л.</b></p>
          <p>Кількість: <b id="count">${details.count}</b></p>
          <div class="btns">
            <div class="btn red">-</div>
            <div class="btn green">+</div>
          </div>
          <div class="btn">Закрити</div>
        `;
        const [decBtn, incBtn, closeBtn] = document.querySelectorAll("dialog .btn");
        decBtn.addEventListener("click", async function() {
          await changeCount(details.id, false);
        });
        incBtn.addEventListener("click", async function() {
          await changeCount(details.id, true);
        });
        closeBtn.addEventListener("click", function() {
          closeDialog();
        });
        dialog.showModal();
      }).catch(function (e) {
        console.error(e.message);
        alert(e.message);
      });
  }

  async function openCreation() {
    dialog.innerHTML = `
    <form>
      <input type="text" placeholder="Що за банка?" max="50">
      <input type="number" placeholder="Скільки літрів? (0,5/1/2/3)" min="0,07" max="3">
      <input type="number" placeholder="Вкажіть кількість (0)" min="0">
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>
    `;
    const [name, capacity, count] = document.querySelectorAll("input");
    const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
    saveBtn.addEventListener("click", async function() {
      const error = validateCreationInputs(name.value, capacity.value, count.value);
      if (error) return alert(error);
      await fetch(`/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name.value, capacity: +capacity.value, count: +count.value}),
      }).then(async function (data) {
        if (!data.ok) {
          const res = await data.json();
          throw new Error(res.error);
        }
        closeDialog();
        await renderList();
      }).catch(function (e) {
        console.error(e.message);
        alert(e.message);
      });
    });
    closeBtn.addEventListener("click", function() {
      closeDialog();
    });
    dialog.showModal();
  }

  async function openRename(id, oldName) {
    dialog.innerHTML = `
    <form>
      <input type="text" placeholder="Що за банка?" max="50" value="${oldName}">
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>
    `;
    const name = document.querySelector("input");
    const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
    saveBtn.addEventListener("click", async function() {
      const error = validateName(name.value, oldName);
      if (error) return alert(error);
      await fetch(`/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name.value}),
      }).then(async function (data) {
        if (!data.ok) {
          const res = await data.json();
          throw new Error(res.error);
        }
        closeDialog();
        await renderList();
      }).catch(function (e) {
        console.error(e.message);
        alert(e.message);
      });
    });
    closeBtn.addEventListener("click", function() {
      closeDialog();
    });
    dialog.showModal();
  }

  async function openDelete(id, name) {
    dialog.innerHTML = `
    <form>
      <p>Справді видалити ${name}?</p>
      <div class="btns">
        <div class="btn red">Видалити</div>
        <div class="btn green">Скасувати</div>
      </div>
    </form>
    `;
    const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
    saveBtn.addEventListener("click", async function() {
      await deleteItem(id);
      closeDialog();
    });
    closeBtn.addEventListener("click", function() {
      closeDialog();
    });
    dialog.showModal();
  }

  addItemBtn.addEventListener("click", async function() {
    await openCreation();
  });
  dialog.addEventListener("click", function(e) {
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
      dialog.open &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      closeDialog();
    }
  });
  dialog.addEventListener("keydown", function(e) {
    if (e.code === "Escape" && dialog.open) closeDialog();
  });
});
