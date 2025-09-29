DONE: need to check if img starts with https://example.com then use static imgs from public

also do we need to store the menu frm api inside redux ?? or not ?

DONE:implement cart system for user to add items and checkout/pay/order

DONE:user should be able to click on menuitem to expand and show more details of item

give user a popup for login if he wants to click on checkout without logining

HALF DONE:after logic user should enter address and pinpoint the location on map .. no delivery available if he is outside 40kms radius of our location

DONE without any enums for label: user should also be able add other details before order eg: address , delievered to him or others so we can ask for contact numb of that user if not call on same number and he can save the address to his his account ex: home, work, others [rahulfrnd, frnd2, aunt]

try to limit spiceLevel btw 1-3

also can we add menuOrder kinds thing for categories as well ? bcz i want to able to control which category to be first etc ? is adding order to that nesesary or any other way to do without touching db menu data or model/schema?

DONE:within menu modal , add more details here later, like ingredients or allergens

<!--  -->

show quantity of items like 2x199 etc in cart page

in enhanced menu if we add same item twice the quantity is being incresed shows 1 item

<!--  -->

everytime user opens cart for check always check if the items are avaialble or not from backend

<!--  -->

always highlight to add the mobile numb of user if not present , and always ask if thats the numb heshe want to be contacted on .. mobile number is mandatory and primary mode of contact

<!--  -->

We dont have ETA for orders
Maps for users to be only witin 40kms range of our location
Login popup page
Paymentpage just like resumeonfly

<!-- DONE: -->

After admin has changed the status .. The user page is not reflecting the change of Placed to confirm etc , and if userend he refreshes the page the order page is not loading and being redirected to home , even if i go to the url of order http://localhost:3000/orders/68b03f7866d7d76434712a48 it takes me back to home

<!--  -->

Have to show the ETA of order and discountAmount or deliveryCharges on both cart and checkout page and orderpage
We also have to check like COD does other payment ways are working or not
May be remove cancel order and review btns inside orderpage for now (maybe replace review btn with rating)

<!--  -->

Create a seperate page for user to find all (his previous or current) orders
Also enhance the order page inside admin panel

<!--  --> in onenote ffor better view

In orderpage add support btn which popups the contact details of us .. Later we will upgrade that to chat and will connect to adminpanel for admin to handle those

First orders page - then payment from resumeonfly and then map system for userradius

NOW

User should not be able place order when he has an active order already being processed, how can we do that ?

DONE

A

Add filter search and sort functionalities inside admin orders and menu for better ux for admin

DONE on order not menu yet

Also we have to check before completing the order wether the payment has been done or not when COD. or If status has changed to delivered then payment should show as paid automatically

Do we check the items avaialbility before checkout or payment ?

Why dont our orderadmin and adminmenu routes have verifyAdminfirebasetoken auth ???

DONE

Loader btw the transition of payment and recdirecting to orderedpage

No auto refresh of order in adminconsole

Orderpage should only reload if status is not delivered or cancelled , can we do that ?

Test deliver to someone else scenario

Adminconsole orders / order expand not showing : deliver to someone else Data

<!--  -->

frm cartpage after user loggins he gets alert of login and store missing imidiaetly AFTERl he successfully logs in

<!-- IMP -->

we are not SHOWING user Lat and longitude of user inside ADMIN CONSOLE
