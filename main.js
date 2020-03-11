document.addEventListener('DOMContentLoaded', function() {

    var myKey;
    var DATA;
    var request = new XMLHttpRequest();//Получаем данные из json файла
    request.open('GET', 'lpu.json');
    request.onloadend = function()
    {
        DATA = JSON.parse(request.responseText);

        for (var key in DATA) {

            try { //Получаем исключение, если место в localStorage недостаточно
                if(localStorage.getItem(key) == null) //Если в памяти еще нет элемента с таким ключом, чтобы не обновлять то что уже лежит в памяти
                {
                    localStorage.setItem(key, JSON.stringify(DATA[key]));//Добавляем значени из json в localStorage
                }
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Превышен лимит');
                }
            }
        }
        getStorage();
    }
    request.send();

    var user_form = document.getElementById('user_form');//Отлавливаем событие отправки формы
    user_form.addEventListener("submit", function (event) {
        event.preventDefault();
        updateList(user_form);
        return false;
    });

    document.addEventListener("click", function(e) {//Отлавливаем клик по кнопке

        if (e.target.name=="delete_ins") { //Удаляем организацию
            ins_id = e.target.value;
            sure = confirm("Вы действительно хотите удалить организацию?");
            if(sure == true)
            {
                localStorage.removeItem(ins_id);
                clearFormInput();
                getStorage();
            }
        }
        else if(e.target.name=="update_ins") //Редактируем организацию
        {
            ins_id = e.target.value;
            user_json = JSON.parse(localStorage.getItem(ins_id));
            console.log(user_json);

            user_form.elements["full_name"].value = user_json['full_name'];
            user_form.elements["address"].value = user_json['address'];
            user_form.elements["phone"].value = user_json['phone'];
            user_form.elements["ins_id"].value = ins_id;
        }
    });

    function clearFormInput()//Ощищаем все input формы
    {
        user_form.elements["full_name"].value = '';
        user_form.elements["address"].value = '';
        user_form.elements["phone"].value = '';
        user_form.elements["ins_id"].value = '';
    }

    function updateList(user_form)//Обновление данных организации
    {
        var full_name = user_form.elements["full_name"].value;
        var address = user_form.elements["address"].value;
        var phone = user_form.elements["phone"].value;
        var ins_id = user_form.elements["ins_id"].value;

        if(full_name == '' || address == '' || phone == '') //Проверка входных данных
        {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        if(ins_id == '') //Если ins_id(ключ элемента) пустой, то создаем новую запись иначе обновляем
        {
            ins_id = Number(myKey)+1;
        }

        update_json = '{"full_name":"' + full_name +'","address":"' + address + '","phone":"' + phone +'"}';
        localStorage.setItem(ins_id, update_json);

        clearFormInput();
        getStorage();
    }
    function getStorage() //Вывод организаций из памяти
    {
        insert_html = '';
        ins_list = document.getElementById('ins_list');
        ins_list.innerHTML = '';

        if(localStorage.length != 0) {
            for (i = 0; i < localStorage.length; i++) {
                myKey = localStorage.key(i);
                user_json = JSON.parse(localStorage.getItem(myKey));
                console.log(user_json);

                insert_html += '<div class="one_ins">';
                insert_html += '<div class="row">';
                insert_html += '<div class="col-sm-3"><p>' + user_json['full_name'] + '</p></div>';
                insert_html += '<div class="col-sm-3"><p>' + user_json['address'] + '</p></div>';
                insert_html += '<div class="col-sm-3"><p>' + user_json['phone'] + '</p></div>';
                insert_html += '<div class="col-sm-3">';
                insert_html += '<button name="update_ins" class="btn btn-primary" value="' + myKey + '">Редактировать</button>';
                insert_html += '<button name="delete_ins" class="btn btn-danger" value="' + myKey + '">Удалить</button>';
                insert_html += '</div>';
                insert_html += '</div>';
                insert_html += '</div>';
            }
        }
        else
        {
            insert_html = '<p class="not_found">Нет организаций</p>';
        }
        ins_list.innerHTML = insert_html;
    }
});
