/* Client scripts module */



async function onInit(): Promise<void> {

    const str = await Namespace.storage.getItem( "logs" )
    // debugger
    if ( str ) {
        const storage_logs: any[] = JSON.parse( str! )
        storage_logs.forEach( ( elem ) => {
            ViewContext.data.logs == undefined ? ViewContext.data.logs = `- ${ JSON.stringify( elem ) }\r\n` : ViewContext.data.logs += `- ${ JSON.stringify( elem ) }\r\n`
        } )
    }
}

async function clear(): Promise<void> {
    await Namespace.storage.setItem( "logs", "[]" )
    ViewContext.data.logs = ""
}
