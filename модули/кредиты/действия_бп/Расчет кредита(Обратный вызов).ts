/**
Для модели обратного вызова:
    async function action(url: string): Promise<void>;
    async function callback(req: HTTPRequest): Promise<void>;

**/

async function Log( title: string, obj: any ): Promise<void> {
    if ( !Namespace.params.data.enable_logs ) {
        return;
    }

    const str = await Namespace.storage.getItem( 'logs' );
    const logs: any[] = JSON.parse( str! );

    logs.push( {
        title,
        data: obj
    } )

    await Namespace.storage.setItem( 'logs', JSON.stringify( logs ) )
}


class TPayment {
    amount: number
    percent: number
    period: number
    payment: TMoney<"RUB">
}

async function action( url: string ): Promise<HttpResponse | void> {
    await Log( 'Action START: ', Context.data )
    await Log( 'Action webhook url: ', url )
    const res = await fetch( Context.data.url!,
        {
            method: "POST",
            body: JSON.stringify(
                {
                    amount: 30000,
                    percent: 20,
                    period: 24,
                    url
                } )
        }
    )
}

async function callback( req: FetchRequest ): Promise<void> {
    Log( "Callback START with request: ", req )
    if ( !req.body ) {
        await Log( "CallBack not body: ", req )
        return
    }
    const result = <TPayment>JSON.parse( req.body as string )

    if ( result ) {
        Log( "Callback RETURN", result )
    }

    let centsArraya = `${ result.payment.cents }`.split( "" )
    centsArraya.splice( centsArraya.length - 1, 0, "." )
    Context.data.payment = new Money( parseFloat( centsArraya.join( "" ) ), "RUB" )
}