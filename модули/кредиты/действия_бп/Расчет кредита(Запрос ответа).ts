class TPayment {
    amount: number
    percent: number
    period: number
    payment: TMoney<"RUB">

}

const baseurl = "https://cp6yx7s6ah6fa.elma365.ru/api/extensions/8757ef9a-5c51-445d-8067-59d5d9f4b482/script"


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
    await Log( 'Старт действия расчет кредита с контекстом: ', Context.data )
    const res = await fetch( `${ baseurl }/calccredit?amount=${ Context.data.loan_amount }&percent=${ Context.data.percent }&period=${ Context.data.period }`,
        {
            method: "POST",
            body: ""
        }
    )
    if ( res.ok ) {
        const data = await res.json()
        await Log( "Ответ для действия расчет кредита получен c данными: ", { jobId: data.jobId, response: res } )
        Context.data.jobid = data.jobId
        await Log( "jobId сохранен в контекст", Context.data.jobid )
    }
}


async function check(): Promise<boolean> {
    await Log( "Старт проверки результата запроса по действию рачет кредита с контекстом: ", Context.data )
    const res = await fetch( `${ baseurl }/checkcredit?jobId=${ Context.data.jobid }`,
        {
            method: "POST",
            body: ""
        }
    )
    if ( res.ok ) {
        try {
            const data: TPayment = await res.json()
            Log( "Check is good: ", data )
            let centsArraya = `${ data.payment.cents }`.split( "" )
            centsArraya.splice( centsArraya.length - 2, 0, "." )
            Context.data.payment = new Money( parseFloat( centsArraya.join( "" ) ), "RUB" )
            return true
        } catch ( e ) {
            Log( "Chack fail: ", e.message )
            return false
        }

    }
    return false
}