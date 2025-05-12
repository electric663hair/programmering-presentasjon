# f = open("./input.data").read().split("\n")

# output = ""
# for line in f:
#     output += line + "\\n"

# of = open("./output.data", "w")
# of.write(output)

# while True: # Kjører programmet til brukeren manuelt stopper det
#     brukertall = int(input("Skriv inn et tall: ")) # Får et tall fra brukeren
    
#     def f(x): # Lager en funksjon som tar inn X som en variabel
#         return (x+15*x)/2 # Returnerer et tall basert på X sin verdi

#     print(f"x:{brukertall}; y:{f(brukertall)}\n") # Printer både x og y verdi

# while true: # Kjører programmet til brukeren manuelt stopper det\n     brukertall == int(input(\"Skriv inn et tall: )) # Får et tall fra brukeren\n\n    function f(x): # Lager en funksjon som tar inn X som en variabel\n        return (x+15*x)/2 # Returnerer et tall basert på X sin verdi\n\n    print(f\"x:{brukertall}; y:{f(brukertall)}\")) # Printer både x og y verdi\n

# with open("./input.data") as file:
#     sum = 0
#     for line in file.read().split("\n"):
#         sum += int(line)
#     print(sum)

# def kommenter_farge(farge)<br>    if farge = "blå":<br>        print("Blått er en rolig og fin farge!")<br>    elif farge == "rød"<br>        print("Rødt er en energisk farge!"<br>    else<br>        print("Det er også en flott farge.")<br><br>brukerfarge = input("Hva er favorittfargen din? ")<br>kommenter_farge(brukerfarge)

def kommenter_farge(farge):
    if farge == "blå":
        print("Blå er en rolig og fin farge!")
    elif farge == "rød":
        print("Rød er en energisk farge!")
    else:
        print("Det er også en flott farge.")

brukerfarge = input("Hva er favorittfargen din? ")
kommenter_farge(brukerfarge)