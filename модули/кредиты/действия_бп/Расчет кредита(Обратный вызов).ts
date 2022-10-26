const Context = {
    data: {
        payment: 1000,
        url: "https://google.com"
    }
}


async function Log( title: string, obj: any ) {
    if ( !Namespace.params.data.enable_logs ) {
        return
    }

    const str = await Namespace.storage.getItem( 'logs' );
    const logs: any[] = []; JSON.parse( str! );

    logs.push( {
        title,
        data: obj,
        createdAt: new Date(),
    } )

    await Namespace.storage.setItem( "logs", JSON.stringify( logs ) )
}

const baseurl = "https://cp6yx7s6ah6fa.elma365.ru/api/extensions/8757ef9a-5c51-445d-8067-59d5d9f4b482/script/callwebhook"


class TPayment {
    amount: number
    percent: number
    period: number
    payment: TMoney<"RUB">
}

async function action( url: string ): Promise<HttpResponse | void> {
    await Log( 'Action START: ', Context.data )
    await Log( 'Action url: ', url )
    const res = await fetch( Context.data.url!,
        {
            method: "POST",
            body: JSON.stringify(
                {
                    amount: 30000,
                    percent: 20,
                    period: 24
                } )
        }
    )

    if ( res.ok ) {
        await Log( "Calwebhook RES OK", res )
        const data = await res.json()
        Context.data.payment = data.payment
        Log( 'Action FINISH: ', Context.data )
        let nres = new HttpResponse( HttpStatusCode.OK )
        nres.content( "blabla" )
        return nres
    }
    else {
        Log( 'Action ERROR: ', JSON.stringify(
            {
                amount: 30000,
                percent: 20,
                period: 24
            } ) )
    }
}
// НЕ СТАРТУЕТ CALLBACK
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
    Context.data.payment = new Money( result.payment.cents, "RUB" )
}