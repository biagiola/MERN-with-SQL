-- @block
select  tbl_providers.id         as provider_id, 
        tbl_providers.name       as provider_name, 
        tbl_providers.active     as provider_active, 
        tbl_ddis.id              as ddi_id, 
        tbl_ddis.ddis            as ddi_principal, 
        tbl_ddis.ddis_associated as ddi_associate, 
        tbl_ddis.active          as ddi_active, 
        tbl_circuits.identifier  as circuit_identifier, 
        tbl_circuits.host        as circuit_host,
        tbl_circuits.port        as circuit_port

from tbl_providers, tbl_ddis, tbl_circuits;

SELECT  tbl_providers.id         as provider_id, 
        tbl_providers.name       as provider_name, 
        tbl_providers.active     as provider_active, 
        tbl_ddis.id              as ddi_id, 
        tbl_ddis.ddis            as ddi_principal, 
        tbl_ddis.ddis_associated as ddi_associate, 
        tbl_ddis.active          as ddi_active, 
        tbl_circuits.identifier  as circuit_identifier, 
        tbl_circuits.host        as circuit_host,
        tbl_circuits.port        as circuit_port,
        tbl_circuits.date_in     as date_in

FROM tbl_providers
    JOIN tbl_ddis ON tbl_providers.id = tbl_ddis.id_provider 
    JOIN tbl_circuits ON tbl_providers.id = tbl_circuits.id_provider;
    