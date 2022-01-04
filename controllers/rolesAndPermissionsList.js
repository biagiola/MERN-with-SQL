let rolesAndPermissionsList = {
  // ADMINS
  0: {                                 
    /* roles */
    id: 0,
    name: 'admin',                           
    slug: 'administrator',                   
    desc: 'administrator description',       
    /* permissions array */
    permissions: {
      // C.R.U.D. admins && users
      0: {
        id: 0,                                  
        code: [1,1,1,1,1,1,1,1],                  
        name: 'crud-admin_&_crud_users',                        
        slug: 'crud admins and users',            
        desc: 'crud admins and users description' 
      } ,
      // C.R.U._ admins && C.R.U.D users
      1: {
        id: 1,                               
        code: [1,1,1,0,1,1,1,1],                   
        name: 'crud-admin_&_cru-user',                     
        slug: 'crud admins and cru users',         
        desc: 'crud admins and cru users desc'     
      }
    }
  },

  // USERS
  1: {                                 
    // roles
    id: 1,
    name: 'user',                    
    slug: 'user',              
    desc: 'user description',  
    // permissions array 
    permissions: {
      // C.R._._ ONLY USERS
      0: {
        id: 0,
        code: [0,0,0,0,1,1,0,0],          
        name: 'cr-u',                     
        slug: 'create read users',        
        desc: 'create read users only'    
      }, 
      1: {
        // _.R._._ ONLY USERS
        id: 1,
        code: [0,0,0,0,0,1,0,0],          
        name: 'r-u',                      
        slug: 'read users',               
        desc: 'read users only'           
      }
    }
  } 
}

module.exports.rolesAndPermissions = rolesAndPermissionsList;