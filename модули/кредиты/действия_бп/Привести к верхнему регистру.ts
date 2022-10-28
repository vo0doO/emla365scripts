async function action(): Promise<void> {
    Context.data.line = Context.data.line?.toUpperCase()
    Context.data.uppercase = Context.data.line?.toUpperCase()
    Context.data.error = "Ошибок нет"
}