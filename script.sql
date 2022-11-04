create database cervejaLager;
use cervejaLager;

create table lager (
    id_Lager int primary key auto_increment,
    data_hora datetime,

    steeping double,

    malting_1 double,
    malting_2 double,
    malting_3 double,

    milling double,

    mashing_1 double,
    mashing_2 double,
    mashing_3 double,
   
    brewing double,

    cooling_1 double,
    cooling_2 double,
    cooling_3 double,

    maturation_filtration double,

    flash_pasteurization_packaging double,

    final_product double


)

create user 'usuarioCervejaria'@'localhost' identified by 'sptech';
grant insert on cervejaLager.lager to 'usuarioCervejaria'@'localhost';
flush privileges; 
