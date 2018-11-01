# masterpassword-edge
Master Password implemented as a Edge extension

This is a edge extension implementing the masterpassword algorithm invented by Maarten Billemont. You can visit his website at [masterpasswordapp.com](http://masterpasswordapp.com). 

**Please note that this plugin is not affiliated with Mr Billemont**

The site settings will sync between your edge installations if you have edge sync enabled. (also in incognito)

# Installation

Find the extension at in the appstore [here](about:blank)

or download from the [releases page](https://github.com/CodeBeast357/masterpassword-edge/releases) and:

# Incognito mode
Exensions are by default prevented from running in incognito mode. You can allow the masterpassword exension in by visiting the [N/A](about:blank) exension settings and check the box. Masterpassword will *not* save site configs when in incognito mode.

# Changing the site name
Many sites (like google) have localized url's (google.de, google.co.uk etc). It is recommended that you use the global (ie google.com) as the site name in such cases.

When you first open masterpassword on a localized domain, that domain will be suggested in masterpassword. You can change this. It will be remembered for your next visit.

If you have several accounts at a domain, it is suggested to prefix the site name with something like "username@" (ie myself@google.com). The site name in masterpassword will change to a dropdown if you have multiple variants.

# Algorithm versions and compatibility
The MasterPassword algorithm have gone through several revisions as bugs and unfortunate design descisions have
been discovered. This addon implements v3 of the algorithm. You should have no problem interoperating with other
apps using the same version. Additionally you will get the same passwords for apps using the v2, as long as your master user name only contains [ascii](https://en.wikipedia.org/wiki/ASCII) letters, numbers and symbols. In particular that means you should avoid non english/latin characters like æ,ø,å,ß,€ and similar in your name, if you need to mix v2 and v3.


# Differences on name and phrase type passwords
`version >= 2.0`

There was a descrepancy between how MasterPassword for Firefox and other implementations handled
passwords with the type *name* and *phrase*. This has been corrected in versions after 2.0rc2. To get the old
behaviour select the *name (v)* or *phrase (v)* option.

Specifically, versions prior to 2.0rc2 forced the *variant* for such types to be respectively *login* or *answer*.
The variant concept is not commonly available in other implementations.
