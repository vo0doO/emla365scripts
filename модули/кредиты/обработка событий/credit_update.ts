async function Log( title: string, obj: any ): Promise<void> {
    if ( !Namespace.params.data.enable_logs ) {
        return;
    }

    const str = await Namespace.storage.getItem( 'logs' );
    const logs: any[] = JSON.parse( str! );

    logs.push( {
        title,
        data: obj,
        createdAt: new Date()
    } )

    await Namespace.storage.setItem( 'logs', JSON.stringify( logs ) )
}

async function action(): Promise<void> {

    if ( !Context.data.__item ) {
        return;
    }

    if ( Context.data.__item.namespace !== "edu_dev_17_10" ) {
        return;
    }

    if ( Context.data.__item.code !== "credit" ) {
        return;
    }

    const logObj = {
        nspace: Context.data.__item.namespace,
        code: Context.data.__item.code,
        id: Context.data.__item.id,
        data: Context.data.__data
    }

    await Log( `listener: ${ Context.data.__name }`, logObj );
}