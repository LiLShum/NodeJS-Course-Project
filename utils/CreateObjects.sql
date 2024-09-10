CREATE TABLE Services
(
    service_id nvarchar(50) not null primary key,
    service_name nvarchar(50) not null,
    description nvarchar(300) not null,
    price smallmoney not null
);

CREATE TABLE Employees
(
    employee_id nvarchar(50) primary key,
    employee_name nvarchar(50) not null,
    sex nvarchar(10) not null
);

CREATE TABLE Orders
(
    order_id nvarchar(50) primary key,
    user_id nvarchar(50) not null,
    employee_id nvarchar(50) not null,
    price smallmoney null,
    service_id nvarchar(50) not null,
    date_of_order date not null,
    FOREIGN KEY (service_id) REFERENCES Services(service_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);

CREATE TABLE User_message
(
    message_id int not null,
    user_id nvarchar(50) not null,
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages
(
    message_id nvarchar(50) primary key,
    message nvarchar(max) not null,
    date_and_time date not null,
);

CREATE TABLE Users
(
    user_id nvarchar(50) primary key,
    username nvarchar(50) not null,
    email nvarchar(50) not null,
    password nvarchar(50) not null,
    role nvarchar(10) not null,
);

select * from Users;
