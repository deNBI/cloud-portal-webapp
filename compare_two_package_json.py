import json
import sys


def get_deps_from_package_json(file_name):
    with open(file_name, "r") as package_json:
        data = json.load(package_json)
        return data["dependencies"]


def get_dev_deps_from_package_json(file_name):
    with open(file_name, "r") as package_json:
        data = json.load(package_json)
        return data["devDependencies"]


def compare_deps(dep_one, dep_two):
    deps_to_return = {}
    for k, v in dep_one.items():
        if k in dep_two:
            if v != dep_two[k]:
                print(f"Different value found for {k}: {v} and {dep_two[k]}. Which one do you want to keep? Choose: 1/2 default is 2")
                to_keep = input()
                if to_keep == 1:
                    deps_to_return[k] = v
                else:
                    deps_to_return[k] = dep_two[k]
            else:
                deps_to_return[k] = v
        else:
            print(f'First package.json has dependency not found in second package.json: "{k}":"{v}". Do you want to keep it? Choose y/n default is n')
            to_keep = input()
            if to_keep == "y" or to_keep == "Y" or to_keep == "yes" or to_keep == "Yes":
                deps_to_return[k] = v
    for k, v in dep_two.items():
        if k in dep_one:
            continue
        else:
            print(f'Second package.json has dependency not found in first package.json: "{k}":"{v}". Do you want to keep it? Choose y/n default is n')
            to_keep = input()
            if to_keep == "y" or to_keep == "Y" or to_keep == "yes" or to_keep == "Yes":
                deps_to_return[k] = v
    return deps_to_return

def write_deps_to_file(file_name, deps_to_write, dev_deps_to_write):
    with open(file_name, "r+") as package_json:
        data = json.load(package_json)
        data["dependencies"] = deps_to_write
        data["devDependencies"] = dev_deps_to_write
        package_json.seek(0)
        package_json.write(json.dumps(data, indent="\t"))
        package_json.truncate()


if __name__ == "__main__":
    deps_one = get_deps_from_package_json(sys.argv[1])
    dev_deps_one = get_dev_deps_from_package_json(sys.argv[1])
    deps_two = get_deps_from_package_json(sys.argv[2])
    dev_deps_two = get_dev_deps_from_package_json(sys.argv[2])
    print(f"Comparing dependencies of {sys.argv[1]} and {sys.argv[2]}")
    deps = compare_deps(deps_one, deps_two)
    print()
    print(f"Comparing devDependencies of {sys.argv[1]} and {sys.argv[2]}")
    dev_deps = compare_deps(dev_deps_one, dev_deps_two)
    write_deps_to_file(sys.argv[1], deps, dev_deps)
