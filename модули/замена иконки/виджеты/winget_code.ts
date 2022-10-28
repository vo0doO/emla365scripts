<% if ( Context.data.icon_enable ) { %>
    <script>
    let icon = document.getElementsByClassName( "side-nav__item-link-logo-src" )
    console.log( "Icon", icon )
    $( icon ).css( "background-image", 'url("<%= Context.data.icon_url%>")' )
    $( icon ).css( "width", "<%= Context.data.icon_width%>px" ).css( "height", "<%= Context.data.icon_height%>px" )
        < /script>
        <% } %>