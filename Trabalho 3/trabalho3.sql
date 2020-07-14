create table usuario_sistema(
	id_usuario_sistema int(11) not null auto_increment,
	nome varchar(45),
	email varchar(45),
	senha varchar(45),
	D_E_L_E_T_ int(1),
	primary key(id_usuario_sistema)
);

create table aluno(
	id_aluno int(11) not null auto_increment,
	nome varchar(45) not null,
	rg varchar(12),
	cpf varchar(11) not null,
	data_nascimento date,
	email varchar(30),
	D_E_L_E_T_ int(1),
	primary key(id_aluno)
);

create table cargo(
	id_cargo int(11) not null auto_increment,
	nome varchar(50),
	valor float(10.2),
	primary key(id_cargo)
);

create table professor(
	id_professor int(11) not null auto_increment,
	nome varchar(40),
	rg varchar(12),
	cpf varchar(11),
	data_nascimento date,
	id_cargo int(11) not null,
	foreign key(id_cargo) references cargo(id_cargo),
	primary key(id_professor)
);

create table fase(
	id_fase int(11) not null auto_increment,
	nome varchar(50),
	primary key(id_fase)
);

create table turma(
	id_turma int(11) not null auto_increment,
	titulo varchar(45) not null,
	codigo_turma varchar(5),
	ano date,
	id_fase int(11) not null,
	id_professor_responsavel int(11) not null,
	foreign key(id_fase) references fase(id_fase),
	foreign key(id_professor_responsavel) references professor(id_professor),
	primary key(id_turma)
);

create table turma_aluno(
	id_turma_aluno int(11) not null auto_increment,
	id_aluno int(11) not null,
	id_turma int(11) not null,
	foreign key(id_aluno) references aluno(id_aluno),
	foreign key(id_turma) references turma(id_turma),
	primary key(id_turma_aluno)
);


