var client = ZAFClient.init();

async function getSystemURL(){
    const metaData =  await client.context();
    if (metaData.host == 'zendesk'){
        return `https://${metaData.account.subdomain}.zendesk.com`

    }
    console.log("Could not fetch system metadata to determine the subdomain.")
    return 0
}

async function showAbout(){
    const modalContext = await client.invoke('instances.create', {
        location: 'modal',
        url: 'assets/about.html',
        size: { // optional
            width: '40vw',
            height: '60vh'
        }
    });
}

function addRowToTable(index,entity_id,entity_name,entity_type,entity_managing,entity_created_at,entity_updated_at,tableType) {
	var table = document.getElementById(tableType);
	var row = table.insertRow(-1);
    var row_checkbox = row.insertCell(0);
	var row_entity_id = row.insertCell(1);
	var row_entity_name = row.insertCell(2);
    var row_entity_type = row.insertCell(3);
    var row_entity_managing = row.insertCell(4);
	var row_entity_created_at = row.insertCell(5);
	var row_entity_updated_at = row.insertCell(6);
    row.id = "row_"+entity_id;
	row_entity_id.innerHTML = entity_id;
	row_entity_name.innerHTML = entity_name;
    row_entity_name.id = 'name_'+entity_id;
	row_entity_created_at.innerHTML = entity_created_at;
	row_entity_updated_at.innerHTML = entity_updated_at;
    row_entity_type.innerHTML = entity_type;
    row_entity_managing.innerHTML = entity_managing;
    return;
}

async function getOrphanedUsers() {
    var usersCount = 1 ;
    const systemURL = await getSystemURL();
    for (page=1; page<=usersCount; page++){
        var x = await client.request('/api/v2/users?page='+page);
        usersCount = Math.ceil(x.count/100)
        for (let i = 0; i < x.users.length; i++) {
            if (x.users[i].organization_id == null){
                addRowToTable(i+1,x.users[i]['id'],"<a href=\""+systemURL+"/users/"+x.users[i]['id']+"\" target =\"_blank\">"+x.users[i]['name']+"</a>"+"  -  "+x.users[i]['email'],'','',
                x.users[i]['created_at'],x.users[i]['updated_at'],'orphaned_users_table');
            }
        }
    }    
    return;
} 

getOrphanedUsers();