async function testWebHook( req: FetchRequest ): Promise<void> {
    const input = JSON.parse( req.body as string )
    await Log( "Start testWebHook API with URL: ", input.url )
    // await Log("Complete FETCH REQUEST to URL: ", input.url)
    await fetch( input.url, {
        method: "POST",
        body: JSON.stringify( {
            result: "Bee OK !"
        } )
    } )

    // request.then((resp)=>{Log("Test WEB HOOK REQUEST WITH URL: ", resp)})
    await Log( "Test WEB HOOK REQUEST WITH URL complete: ", input.url )

}


class TCreditRequest {
    amount: number
    percent: number
    period: number
    payment: TMoney<"RUB">
    url: string | undefined
}


function broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : ( r & 0x3 | 0x8 );
        return v.toString( 16 );
    } );
}


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


async function calccredit( req: FetchRequest ): Promise<HttpResponse | void> {

    const jobId = broofa()
    // получить входные данные
    await Log( "Calc credit web api start with query: ", req.query )
    const amount = parseFloat( req.query?.[ "amount" ] as string )
    const percent = parseFloat( req.query?.[ "percent" ] as string )
    const period = parseFloat( req.query?.[ "period" ] as string )


    if ( !( amount && percent && period ) ) {
        return new HttpResponse( HttpStatusCode.BAD_REQUEST )
    }

    let result = {
        payment: {},
        amount,
        percent,
        period,
    }

    // расчитать платёж
    try {
        /**
         * Расчет платежа по формуле
         * Платеж = СуммаЗайма * ( Процент * (1+Процент)^Период) / ( (1+Процент)^Период -1 )
         */
        const mounth_percent = ( percent! / 12 ) * 0.01;
        const payment = amount! * ( mounth_percent * Math.pow( 1 + mounth_percent, period! ) / ( Math.pow( 1 + mounth_percent, period! ) - 1 ) )

        if ( payment < 0 || Number.isNaN( payment ) ) {
            throw new Error( "Calc Error: value is NaN" )
        }
        result.payment = new Money( payment, "RUB" )
        await Namespace.storage.setItem( `jobId:${ jobId }`, JSON.stringify( result ) )
        await Log( `Calc complete job result saved with jobId ${ jobId }, платеж: `, result.payment )
    }
    catch ( e ) {
        await Log( "CalcCreditError = > Ошибка при расчетах ! Проверьте данные", {} )
        const res = new HttpResponse( HttpStatusCode.INTERNAL_SERVER_ERROR )
        res.json( { error: `Ошибка при расчетах ! Проверьте данные ${ e.message }` } )
        return res
    }
    // вернуть результат
    const res = new HttpResponse( HttpStatusCode.OK )
    res.json( { jobId: jobId } )
    return res
}


async function checkcredit( req: FetchRequest ): Promise<HttpResponse | void> {
    const jobId = req.query?.[ "jobId" ] as string
    Log( "Получен запрос на возврат результата по jobId = ", jobId )
    const str = await Namespace.storage.getItem( `jobId:${ jobId }` )
    if ( str && str.length > 0 ) {
        const result = JSON.parse( str )
        await Namespace.storage.setItem( `jobId:${ jobId }`, "" )
        const res = new HttpResponse( HttpStatusCode.OK )
        res.json( result )
        Log( `Выдан ответ на возврат результата по jobId ${ jobId }: `, result )
        return res
    }
}


async function callwebhook( req: FetchRequest ): Promise<HttpResponse | void> {
    await Log( "Calc WEBHOOK START with body: ", req.body )
    const input = <TCreditRequest>JSON.parse( req.body as string )
    // получить входные данные
    await Log( "Calc WEBHOOK with input: ", input )

    if ( !( input.amount && input.percent && input.period ) ) {
        return new HttpResponse( HttpStatusCode.BAD_REQUEST )
    }

    // расчитать платёж
    try {
        const mounth_percent = ( input.percent! / 12 ) * 0.01;
        const payment = input.amount! * ( mounth_percent * Math.pow( 1 + mounth_percent, input.period! ) / ( Math.pow( 1 + mounth_percent, input.period! ) - 1 ) )

        if ( payment < 0 || Number.isNaN( payment ) ) {
            throw new Error( "Calc Error: value is NaN" )
        }
        input.payment = new Money( payment, "RUB" )
        const request = fetch( input.url!, {
            method: "POST",
            body: JSON.stringify(
                input
            )
        } )

        request.then( ( response ) => { Log( "Call web hook complete with response: ", response ) } )
    }
    catch ( e ) {
        await Log( "Calc WEBHOOK Ошибка при расчетах ! Проверьте данные", e.message )
        const res = new HttpResponse( HttpStatusCode.INTERNAL_SERVER_ERROR )
        res.json( { error: `Ошибка при расчетах ! Проверьте данные ${ e.message }` } )
        return res
    }
}
