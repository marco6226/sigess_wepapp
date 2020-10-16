CREATE TABLE scm.medic_cases
(
    pk_user "char",
    pk_boss "char",
    pk_business_partner "char",
    case_status "char",
    end_date "char",
    observations "char",
    origin "char",
    code_cie10 "char",
    afected_system "char",
    diagnosis "char",
    all_description_case "char",
    laboral_medic_case "char",
    reason "char",
    pcl "char",
    percentage_pcl "char",
    emit_pcl_date "char",
    pcl_emit_entity "char",
    status_of_qualification "char",
    date_qualification "char",
    qualification_entity_emit "char",
    concept_rehabilitation "char",
    date_concept_rehabilitation "char",
    emit_concept_entity "char",
    require_intervention "boolean",
    sve "char",
    professional_area "char",
    justification "char"
    PRIMARY KEY (pk_user)
);

CREATE TABLE scm.recomendations
(
        generate_recommendations "boolean",
        entity_emit_recommendations "char",
        type "char",
        start_date "date",
        expiration_date "date",
        status "char",
        recommendations "char"

    PRIMARY KEY (pk_user)
);


CREATE TABLE scm.recomendations
(
        generate_recommendations "boolean",
        entity_emit_recommendations "char",
        type "char",
        start_date "date",
        expiration_date "date",
        status "char",
        recommendations "char"

    PRIMARY KEY (pk_user)
);

CREATE TABLE scm.disabilities
(
       start_date "date",
       pk_user "num",
       end_date "date",
       disabilities_days "char",
       type "date",
       cie10_code "date",
       diagnoses "char",

       

    PRIMARY KEY (pk_user)
);


ALTER TABLE scm.medic_cases
    OWNER to postgres;
<!--Alteracion de tabla empleado-->
ALTER TABLE emp.empleado
    ADD COLUMN corporative_phone character varying,
    ADD COLUMN emergency_contact character varying,
    ADD COLUMN phone_emergency_contact character varying,
    ADD COLUMN email_emergency_contact character varying,