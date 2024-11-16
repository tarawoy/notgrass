
# Grass node.js NO-Proxy

# Notes
you take risk!

# Proxy?
No proxy

# How to Use

1. Ensure that Node and Git are installed on your device.
   
2. Open the terminal (CMD/Powershell/Terminal) on your device.

3. Clone this repository. You can use the following command:
   ```shell
   git clone https://github.com/tarawoy/notgrass
   If this method doesn't work, simply save this repository as a zip file. You can find it in the code section at the top right.
   Then, unzip it and copy the path to Powershell and type "cd your path".
   ```

4. Enter the `notgrass` folder:
   ```shell
   cd notgrass
   ```

5. Then install the required libraries:
   ```shell
   npm install
   npm start
   ```
6. Input your userID.

7. Done, grass running smoothly without proxy.


## Code to Get User ID
Goto website grass
inspect element > console
The JavaScript code to get the user ID is:
```javascript
copy(JSON.parse(localStorage.getItem("userId")))
```
UserID auto copy to your clipboard. 

Thank.
